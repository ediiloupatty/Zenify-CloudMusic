"use server";

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, queryD1, initializeD1Tables } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";

export async function uploadTrackAction(formData: FormData) {
  try {
    // 1. Get form data
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;

    if (!title || !category || !file || file.size === 0) {
      return { success: false, error: "Missing required fields" };
    }

    // 2. Upload file to R2
    const bucketName = process.env.R2_BUCKET_NAME || "focus-stream";
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFilename,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Provide the public URL (Assume public bucket mapping)
    // Note: R2 requires a custom domain or public bucket URL for direct access
    const publicR2Url = process.env.R2_PUBLIC_URL || `https://pub-xxxxxxxx.r2.dev`;
    const fileUrl = `${publicR2Url}/${uniqueFilename}`;

    // 3. Save metadata to D1
    // Ensure table exists first (for simplicity in this slice)
    await initializeD1Tables();

    const trackId = crypto.randomUUID();
    await queryD1(
      `INSERT INTO tracks (id, title, category, file_url) VALUES (?, ?, ?, ?)`,
      [trackId, title, category, fileUrl]
    );

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "An error occurred during upload" };
  }
}

export async function deleteTrackAction(trackId: string, fileUrl: string) {
  try {
    const bucketName = process.env.R2_BUCKET_NAME || "music";
    
    // Extract filename from fileUrl
    const urlParts = fileUrl.split("/");
    const filename = urlParts[urlParts.length - 1];

    if (filename) {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: filename,
        })
      );
    }

    await queryD1(`DELETE FROM tracks WHERE id = ?`, [trackId]);
    await queryD1(`DELETE FROM favorites WHERE track_id = ?`, [trackId]); // Clean up favorites too

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: error.message || "An error occurred during deletion" };
  }
}
