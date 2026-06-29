"use client";

import Image from "next/image";

interface CoverImageProps {
  src: string;
  alt: string;
  /** Extra classes on the wrapper div (e.g. "drop-shadow-2xl") */
  className?: string;
  /** Extra classes applied to the inner Image/img (e.g. "object-top fade-in") */
  imageClassName?: string;
  /** Priority loading for above-the-fold images (default false) */
  priority?: boolean;
}

/**
 * Reusable cover-art component that wraps `next/image`.
 *
 * • Uses `fill` mode so it fits whatever container wraps it.
 * • Automatically optimises remote images (WebP/AVIF, responsive sizing).
 * • Falls back to a plain `<img>` for data-URIs or same-origin proxied
 *   covers that don't benefit from server-side optimisation.
 */
export default function CoverImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
}: CoverImageProps) {
  const isDataUri = src?.startsWith("data:");
  const isSameOrigin = src?.startsWith("/") && !src.startsWith("//");

  // Data URIs and same-origin proxied images skip the optimiser.
  if (isDataUri || isSameOrigin) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imageClassName ?? ""}`}
        loading={priority ? undefined : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`object-cover ${imageClassName ?? ""}`}
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}
