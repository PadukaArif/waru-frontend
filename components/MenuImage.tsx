"use client";

import { useState } from "react";

interface MenuImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function MenuImage({
  src,
  alt,
  className = "h-full w-full object-cover",
}: MenuImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 text-center select-none"
        aria-label={alt || "Gambar Menu"}
      >
        <svg
          className="h-8 w-8 text-gray-300 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-[11px] font-medium text-gray-500 line-clamp-1">
          {alt || "Foto Menu"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      loading="lazy"
    />
  );
}
