"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface MediaFile {
  type: "image" | "video";
  src: string;
  alt: string;
}

interface NewsItem {
  id: number;
  date: string; // formatted like "18 NOV, 2025"
  title: string;
  media: MediaFile[];
  slug: string;
}

export default function NewsEventsSection() {
  const { data: newsData = [], isLoading, error } = useQuery<NewsItem[]>({
  queryKey: ["home-news-events"],
  queryFn: async () => {
    const res = await fetch("/api/media?limit=5&include_files=true", {
      cache: "no-store", // ensure fresh data
    });

    if (!res.ok) throw new Error("Failed to load news");

    const json = await res.json();
    const items = Array.isArray(json) ? json : json.data || [];

    return items
      .filter((item: any) => item && item.id) // safety
      .map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title || "Untitled",
        date: format(new Date(item.date), "dd MMM, yyyy").toUpperCase(),
        media: (item.files || []).map((f: any) => ({
          type: f.type as "image" | "video",
          src: f.file_path,
          alt: item.title,
        })),
      }));
  },
  retry: 2,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

  return (
    <section className="py-16 font-serif bg-khaki">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12 tracking-wide">
          News and Events
        </h2>

        {/* Cards Grid - Always 5 columns on large screens */}
        {/* Cards Grid - Responsive: 1–5 columns based on actual data */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12 auto-rows-fr">
  {newsData.map((news) => (
    <Link
      key={news.id}
      href={`/media-center/${news.slug}`}
      className="block h-full group"
    >
      <NewsCard news={news} />
    </Link>
  ))}
</div>

{/* Optional: Show loading skeletons only while loading, not when data is just short */}
{isLoading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
    {[...Array(5)].map((_, i) => (
      <div
        key={`loading-${i}`}
        className="animate-pulse bg-white/10 rounded-lg overflow-hidden shadow-lg"
      >
        <div className="aspect-video bg-white/20" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-white/30 rounded w-3/4" />
          <div className="h-8 bg-white/40 rounded w-full" />
          <div className="h-8 bg-white/40 rounded w-5/6" />
        </div>
      </div>
    ))}
  </div>
)}

        {/* See More Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-khaki hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-full shadow-lg transition-all hover:shadow-xl"
          >
            <Link href="/media-center">
              See More News & Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center text-red-300 mt-8">
            Failed to load news. Please try again later.
          </div>
        )}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Individual Card with Carousel
// ──────────────────────────────────────────────────────────────
function NewsCard({ news }: { news: NewsItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canNavigateNext, setCanNavigateNext] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentMedia = news.media[currentIndex] ?? news.media[0];

  // Auto-advance images every 7 seconds
  // Inside NewsCard – replace the first useEffect (the one with setCanNavigateNext warning)
  // Auto-advance images every 7 seconds — SAFE version
  useEffect(() => {
    if (!currentMedia || currentMedia.type !== "image") return;

    const timer = setTimeout(() => {
      if (currentIndex < news.media.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [currentIndex, currentMedia, news.media.length]);

  const handleVideoEnd = () => {
    setCanNavigateNext(true);
    if (currentIndex < news.media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const goNext = () => {
    if (currentIndex < news.media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  // Auto-play video when it becomes active
  // Auto-play video when it becomes active — SAFE version
  useEffect(() => {
    if (currentMedia?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, currentMedia]);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white">
      {/* Media Container */}
      {/* Media Container – SAFE rendering */}
      <div className="relative aspect-video bg-black shrink-0">
        {currentMedia ? (
          currentMedia.type === "image" ? (
            <Image
              src={currentMedia.src}
              alt={currentMedia.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentMedia.src}
              className="w-full h-full object-cover"
              muted
              playsInline
              onEnded={handleVideoEnd}
            />
          )
        ) : (
          /* Fallback when no media at all */
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white/60 text-sm">No media</span>
          </div>
        )}

        {/* Dots Indicator */}
        {news.media.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {news.media.slice(0, 6).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentIndex ? "bg-white w-8" : "bg-white/60 w-1.5"
                )}
              />
            ))}
            {news.media.length > 6 && (
              <span className="text-white text-xs ml-2">
                +{news.media.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        {news.media.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goPrev();
              }}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-opacity",
                currentIndex === 0 && "opacity-30 cursor-not-allowed"
              )}
              aria-label="Previous media"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goNext();
              }}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-opacity",
                currentIndex === news.media.length - 1 &&
                  "opacity-30 cursor-not-allowed"
              )}
              aria-label="Next media"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Text Content */}
      <div className="p-5 flex flex-col grow">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          News • {news.date}
        </p>
        <h3 className="text-lg font-bold line-clamp-3 leading-tight group-hover:text-khaki transition-colors">
          {news.title}
        </h3>
      </div>
    </Card>
  );
}
