// app/project/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-screen">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <Link href="/slider">
            <Button variant="ghost" className="text-white mb-6">
              <ArrowLeft className="mr-2" /> Back to Projects
            </Button>
          </Link>
          <h1 className="text-6xl font-bold mb-4">{project.title}</h1>
          <p className="text-2xl">{project.category}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="prose prose-lg max-w-none mb-20">
          <p className="text-xl text-gray-700 leading-relaxed">
            {project.description}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua...
          </p>
        </div>

        {/* Gallery */}
        <h2 className="text-4xl font-bold mb-10">Project Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.gallery.map((img, i) => (
            <div
              key={i}
              className="relative aspect-video overflow-hidden rounded-xl shadow-xl group"
            >
              <Image
                src={img}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}