import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/cloudflare";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const bucketName = process.env.R2_BUCKET_NAME || "music";

  // Anti-Hotlinking & IDM Protection
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  
  // Allow only requests coming from our own domain
  if (!referer || !referer.includes(host || "")) {
    return new NextResponse("Forbidden: Direct downloads are not allowed.", { status: 403 });
  }

  try {
    const rangeHeader = request.headers.get("range");

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Range: rangeHeader || undefined,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Convert the AWS SDK stream to a Web ReadableStream
    const stream = response.Body.transformToWebStream();

    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = response.ContentType || "application/octet-stream";
    if (ext === "mp3") contentType = "audio/mpeg";
    else if (ext === "flac") contentType = "audio/flac";
    else if (ext === "wav") contentType = "audio/wav";
    else if (ext === "m4a") contentType = "audio/mp4";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `inline; filename="${filename}"`);
    
    if (response.ContentLength) headers.set("Content-Length", response.ContentLength.toString());
    if (response.ContentRange) headers.set("Content-Range", response.ContentRange);
    headers.set("Accept-Ranges", "bytes");

    const status = response.ContentRange ? 206 : 200;

    return new NextResponse(stream, { status, headers });
  } catch (error: any) {
    console.error("Error streaming audio:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
