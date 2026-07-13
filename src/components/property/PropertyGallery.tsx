"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: {
    url: string;
    alt: string;
  }[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100">
        <Image
          src={mainImage.url}
          alt={mainImage.alt}
          fill
          priority
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                mainImage.url === img.url
                  ? "border-[#1a365d] shadow-md opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
