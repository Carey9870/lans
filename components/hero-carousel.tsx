"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";

import { projects } from "@/lib/projects";

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const totalSlides = projects.length;

  // Wrap goToNext in useCallback to prevent unnecessary re-creations
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalSlides;
    setCurrentIndex(nextIndex);
  }, [currentIndex, totalSlides]);

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  }, [currentIndex, totalSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // GSAP Animation — runs whenever currentIndex changes
  useEffect(() => {
    if (!sliderRef.current) return;

    const slides = sliderRef.current.children as HTMLCollectionOf<HTMLElement>;

    // Kill any ongoing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Instantly put every slide to the right (starting position)
    gsap.set(slides, { x: "100%", opacity: 0 });

    // Animate ONLY the current slide in from the right
    const tl = gsap.timeline();
    tl.to(slides[currentIndex], {
      x: "0%",
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    });

    timelineRef.current = tl;
  }, [currentIndex]);

  // Auto-play — FIXED: dependency on goToNext instead of currentIndex
  useEffect(() => {
    if (!isPlaying) return;
    if (projects[currentIndex].video) return; // 🔥 Stop auto-next for videos

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, goToNext, currentIndex]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  // Pause on hover
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;

    const handleEnded = () => {
      goToNext();
    };

    currentVideo.addEventListener("ended", handleEnded);

    return () => {
      currentVideo.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, goToNext]);

  return (
    <section
      className="relative h-[700px] overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <div ref={sliderRef} className="absolute inset-0 flex">
        {projects.map((project, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full flex flex-col"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              pointerEvents: index === currentIndex ? "auto" : "none",
            }}
          >
            {/* Background: Video OR Image */}
            {project.video ? (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el as HTMLVideoElement | null;
                }}
                src={project.video}
                autoPlay
                controls
                playsInline
                className="absolute inset-0 w-full h-full object-cover brightness-75"
              />
            ) : project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority={index === 0}
                className="object-cover brightness-75"
              />
            ) : (
              <div className="w-full h-full bg-gray-900" />
            )}

            {/* TEXT CONTENT — now guaranteed to be on top */}
            <div className="relative z-10 h-full flex items-center justify-start w-full">
              <div className="max-w-7xl mx-auto flex justify-start w-full">
                <div className="max-w-3xl font-serif text-left">
                  <div className="mb-2">
                    <span className="inline-block px-6 py-3 bg-khaki text-white font-bold rounded-full text-sm uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  <h1 className="text-5xl text-white md:text-3xl font-extrabold mb-2 leading-tight">
                    {project.title}
                  </h1>

                  <p className="text-lg md:text-xl text-white mb-10 max-w-2xl leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex gap-4">
                    <Link href={`/project/${project.slug}`}>
                      <Button
                        size="lg"
                        className="bg-khaki hover:bg-amber-700 text-white font-bold px-10 py-7 text-lg rounded-full shadow-2xl hover:scale-105 transition-all"
                      >
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full backdrop-blur-md border-white/30 text-white bg-green-500 hover:bg-white hover:text-black transition-all"
          onClick={goToPrev}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <div className="flex gap-3">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-white w-10"
                  : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full backdrop-blur-md border-white/30 text-white bg-green-500 hover:bg-white hover:text-black transition-all"
          onClick={goToNext}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 text-white/70 text-sm uppercase tracking-widest z-20">
        {String(currentIndex + 1).padStart(2, "0")} /{" "}
        {String(totalSlides).padStart(2, "0")}
      </div>
    </section>
  );
}

