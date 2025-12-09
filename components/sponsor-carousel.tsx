// components/SponsorCarousel.tsx
import Image from "next/image";
import { Card } from "@/components/ui/card";

const sponsors = [
  { name: "Tesla", logo: "/scroll/fao.png" },
  { name: "SpaceX", logo: "/scroll/rcmrd.jpeg" },
  { name: "xAI", logo: "/scroll/lsk.png" },
  { name: "Neuralink", logo: "/scroll/kip.png" },
  { name: "OpenAI", logo: "/scroll/kpda.png" },
  { name: "DeepMind", logo: "/scroll/isk.png" },
];

export default function SponsorCarousel() {
  return (
    <section className="w-full overflow-hidden bg-amber-50 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative">
          {/* Marquee container */}
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee gap-8 sm:gap-16 py-4">
              {/* Original set */}
              {sponsors.map((sponsor) => (
                <Card
                  key={sponsor.name}
                  className="shrink-0 flex items-center justify-center bg-transparent border-0 shadow-none rounded-lg p-4 transition-all duration-300"
                >
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    width={160}
                    height={80}
                    className="h-12 sm:h-16 w-auto object-contain hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    unoptimized // Needed for external SVG/PNG URLs
                  />
                </Card>
              ))}

              {/* Duplicated set for seamless loop */}
              {sponsors.map((sponsor) => (
                <Card
                  key={`${sponsor.name}-dup`}
                  className="shrink-0 flex items-center justify-center bg-transparent border-0 shadow-none rounded-lg p-4 transition-all duration-300"
                >
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    width={160}
                    height={80}
                    className="h-12 sm:h-16 w-auto object-contain hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    unoptimized
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS - Add this to your globals.css or a module */}
      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 35s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Adjust speed on mobile */
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 45s;
          }
        }
      `}</style>
    </section>
  );
}