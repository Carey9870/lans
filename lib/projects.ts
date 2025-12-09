// lib/projects.ts
export type Project = {
  slug: string;
  title: string;
  category: string;
  image?: string;
  video?: string;
  description: string;
};

export const projects: Project[] = [
  {
    slug: "Valuation",
    title: "Land Administration System",
    category: "Land Administration",
    video: "/hero-carousel/33.mp4",
    description: "Transforming land registry with blockchain-powered transparency and efficiency across East Africa.",
  },
  {
    slug: "Land Registration",
    title: "National Digital Health Platform",
    category: "Healthcare",
    image: "/hero-carousel/5.jpg",
    description: "Connecting hospitals, patients, and records seamlessly across the nation.",
  },
  {
    slug: "Survey and Mapping",
    title: "Smart Cities Initiative",
    category: "Urban Development",
    video: "/hero-carousel/video-3.mp4",
    description: "Building tomorrow's cities with IoT, AI, and sustainable infrastructure.",
  },
  {
    slug: "Physical Planning",
    title: "Road Cities Initiative",
    category: "Rural Development",
    image: "/hero-carousel/7.jpg",
    description: "Building tomorrow's cities with IoT, AI, and sustainable infrastructure.",
  },
  {
    slug: "LAnd Adjudication and Settlement",
    title: "Road Cities Initiative",
    category: "Rural Development",
    video: "/hero-carousel/video-2.mp4",
    description: "Building tomorrow's cities with IoT, AI, and sustainable infrastructure.",
  },
];

