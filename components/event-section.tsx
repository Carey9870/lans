import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

const mediaGallery: MediaItem[] = [
  { type: "image", src: "/events-section/event-1.jpg", alt: "Kenyan n lan" },
  { type: "video", src: "/events-section/video-1.mp4" },
  { type: "image", src: "/events-section/event-2.jpg", alt: "Kenyan landscape" },
  { type: "video", src: "/events-section/video-2.mp4" },
  { type: "image", src: "/events-section/event-3.jpg", alt: "Rural road" },
  { type: "video", src: "/events-section/video-3.mp4" },
];

export default function EventSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = mediaGallery[currentIndex];

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying) return;

    let timeout: NodeJS.Timeout;

    if (currentMedia.type === "video") {
      const video = videoRef.current;
      if (!video) return;

      const handleEnded = () => {
        setCurrentIndex((prev) => (prev + 1) % mediaGallery.length);
      };

      video.addEventListener("ended", handleEnded);
      video.play().catch(() => setIsPlaying(false));

      return () => {
        video.removeEventListener("ended", handleEnded);
        video.pause();
      };
    } else {
      // Image: show for 7 seconds
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaGallery.length);
      }, 7000);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isPlaying, currentMedia.type]);

  const goToNext = () => {
    if (currentMedia.type === "video" && videoRef.current && !videoRef.current.ended) {
      videoRef.current.currentTime = videoRef.current.duration; // Force end
    }
    setCurrentIndex((prev) => (prev + 1) % mediaGallery.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaGallery.length) % mediaGallery.length);
  };

  return (
    <>
      <div className="min-h-9/12 flex flex-col lg:flex-row items-stretch bg-white">
        {/* Left: Gallery */}
        <div className="relative w-full lg:w-1/2 h-96 lg:h-screen overflow-hidden bg-black">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {currentMedia.type === "video" ? (
                <video
                  key={currentIndex}
                  ref={videoRef}
                  src={currentMedia.src}
                  className="w-full h-full object-cover"
                  playsInline
                  controls
                  autoPlay={isPlaying}
                  onLoadedData={() => videoRef.current?.play()}
                />
              ) : (
                <Image
                  src={currentMedia.src}
                  alt={currentMedia.alt || `Gallery image ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                  fill
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Bouncing */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 animate-bounce-left" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 animate-bounce-right" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {mediaGallery.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={clsx(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/80"
                )}
                />
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-linear-to-b from-amber-50 to-white">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-4xl font-serif lg:text-5xl font-bold text-gray-900 leading-tight">
              Welcome to The <span className="underline">State Department</span> for <span className="underline">Lands & Physical Planning</span>
            </h1>

            <div className="space-y-6 font-medium text-lg text-black leading-relaxed">
              <p>
                The State Department for Lands and Physical Planning is a central player in Kenya&apos;s
                socio-economic development plan. Land is one of the key enablers of the Vision 2030
                and the attainment of Millennium Development Goals (MDGs). Land is acknowledged
                as a key determinant of social, economic and political transformation.
              </p>
              <p className="font-medium">
                Although Kenya has had different regimes of land management since independence,
                it is only in 2019 that a definitive land policy was formulated.
              </p>
            </div>

            <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all hover:shadow-xl">
              Read More
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-8px); }
        }
        @keyframes bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        .animate-bounce-left {
          animation: bounce-left 2s infinite;
        }
        .animate-bounce-right {
          animation: bounce-right 2s infinite;
        }
      `}</style>
    </>
  );
}

