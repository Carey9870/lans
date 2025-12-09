// components/gallery-media/gallery-carousel.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { createSlug } from "@/lib/utils";

type MediaItem = {
  id: number;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl?: string | null;
};

type Props = {
  name: string;
  title: string;
  media: MediaItem[];
};

export default function GalleryCarousel({ name, title, media }: Props) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentIndex = ((index % media.length) + media.length) % media.length;
  const current = media[currentIndex];

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (current.type === "IMAGE") {
      timeoutRef.current = setTimeout(() => {
        setIndex((i) => i + 1);
      }, 4000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, current]);

  useEffect(() => {
    if (current.type === "VIDEO" && videoRef.current) {
      const video = videoRef.current;
      const handleEnded = () => setIndex((i) => i + 1);
      video.addEventListener("ended", handleEnded);
      return () => video.removeEventListener("ended", handleEnded);
    }
  }, [current]);

  const goNext = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIndex(i => i + 1);
  };

  const goPrev = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIndex(i => i - 1);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200">
      {/* Media */}
      <div className="aspect-4/5 relative">
        {current.type === "IMAGE" ? (
          <Image
            src={current.thumbnailUrl || current.url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <video
            ref={videoRef}
            src={current.url}
            poster={current.thumbnailUrl || undefined}
            className="w-full h-full object-cover"
            controls
            autoPlay
            playsInline
          />
        )}
      </div>

      {/* Name & Title */}
      <div className="p-6 text-center space-y-2">
        <Link
          href={`/about/management-and-leadership/${createSlug(name, title)}`}
          className="text-xl font-bold text-black leading-tight hover:text-blue-600 transition-colors block"
        >
          {name}
        </Link>
        
        <p className="text-sm text-gray-600 leading-relaxed">{title}</p>
      </div>

      {/* Navigation on hover */}
      <div className="absolute inset-0 opacity-100 flex items-center justify-between px-4">
        <button
          onClick={goPrev}
          className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      {media.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {media.map((_, i) => (
            <div
              key={i}
              className={`transition-all ${
                i === index % media.length
                  ? "bg-white w-6 h-1.5 rounded-full"
                  : "bg-white/60 w-1.5 h-1.5 rounded-full"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
