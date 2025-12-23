"use client";

import HeroCarousel from "@/components/hero-carousel";
import EventSection from "@/components/event-section";
import SponsorCarousel from "@/components/sponsor-carousel";
import NewsEventsSection from "@/components/news-events-section";

export default function Home() {
  return (
    <>
      <div>
        <div>
          <HeroCarousel />
        </div>
        <div>
          <EventSection />
        </div>
        <div>
          <NewsEventsSection />
        </div>
        <div>
          <SponsorCarousel />
        </div>
      </div>
    </>
  );
}
