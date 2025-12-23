// app/media-center/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { query } from "@/lib/db";

interface MediaFile {
  file_path: string;
  type: "image" | "video";
}

interface MediaItem {
  id: number;
  title: string;
  subtitle: string | null;
  story: string | null;
  date: string;
  preview_image: string;
}

export default async function MediaItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const itemRes = await query(`SELECT * FROM media_items WHERE slug = $1`, [slug]);
  if (itemRes.rowCount === 0) notFound();

  const item: MediaItem = itemRes.rows[0];

  const filesRes = await query(
    `SELECT file_path, type, "order"
     FROM media_files 
     WHERE media_item_id = $1 
     ORDER BY "order" ASC`,
    [item.id]
  );

  const files: MediaFile[] = filesRes.rows;

  return (
    <div className="container bg-gray-50 mx-auto max-w-8xl px-4 py-8">
      {/* Back Link */}
      <Link
        href="/media-center"
        className="inline-block mb-8 text-rose-600 hover:text-rose-700 font-medium"
      >
        ← <span className="hover:underline">Back to Media Center</span>
      </Link>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT COLUMN – Media Gallery */}
        <div className="order-2 lg:order-1">
          <div className="bg-fuchsia-50 rounded-sm space-y-6 p-4 max-h-screen overflow-y-auto pb-10 lg:sticky lg:top-8">
            {files.map((file, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl shadow-xl bg-black/5"
              >
                {file.type === "image" ? (
                  <Image
                    src={file.file_path}
                    alt={`${item.title} – ${i + 1}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={file.file_path}
                    controls
                    className="w-full rounded-xl"
                    poster={item.preview_image}
                  >
                    Your browser does not support video.
                  </video>
                )}
              </div>
            ))}

            {files.length === 0 && (
              <p className="text-center text-muted-foreground py-20">
                No media files available.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN – Content */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-8 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-balance">
                {item.title}
              </h1>

              {item.subtitle && (
                <p className="mt-4 text-xl md:text-2xl text-muted-foreground font-serif">
                  {item.subtitle}
                </p>
              )}
              <time className="block mt-4 text-sm text-muted-foreground uppercase tracking-wider">
                {format(new Date(item.date), "dd MMMM, yyyy")}
              </time>
            </div>

            {item.story && (
              <article className="prose prose-lg max-w-none font-serif text-foreground/90 leading-relaxed">
                <div className="whitespace-pre-wrap">{item.story}</div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await query(`SELECT title, story FROM media_items WHERE slug = $1`, [slug]);

  if (res.rowCount === 0) return { title: "Not Found" };

  const item = res.rows[0];
  return {
    title: item.title,
    description: item.story?.slice(0, 160) || "Media gallery item",
    openGraph: {
      images: [item.preview_image],
    },
  };
}