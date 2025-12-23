// app/management-and-leadership/[slug]/page.tsx
import { query } from '@/lib/db';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export async function generateStaticParams() {
  const result = await query(`
    SELECT DISTINCT text, subtext FROM gallery_media WHERE text IS NOT NULL
  `);

  return result.rows.map((row: any) => ({
    slug: `${row.text?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${row.subtext?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/-+$/, ''),
  }));
}

export default async function PersonDetailPage({ params }: { params: { slug: string } }) {
  const result = await query(`
    SELECT 
      id,
      type,
      file_path AS url,
      thumbnail_path AS "thumbnailUrl",
      text AS name,
      subtext AS title
    FROM gallery_media 
    WHERE text || '-' || subtext ILIKE $1
    ORDER BY "order" ASC, id ASC
  `, [`%${params.slug.replace(/-/g, ' ')}%`]);

  const media = result.rows;
  if (media.length === 0) notFound();

  const person = {
    name: media[0].name || "Unknown",
    title: media[0].title || "Position",
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/10 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{person.name}</h1>
          <p className="text-2xl text-muted-foreground">{person.title}</p>
        </div>

        {/* Full-Size Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item: any) => (
            <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              {item.type === "IMAGE" ? (
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={person.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <video
                  src={item.url}
                  poster={item.thumbnailUrl || undefined}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}