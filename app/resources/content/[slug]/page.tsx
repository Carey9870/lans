// app/resources/content/[slug]/page.tsx
import { notFound } from "next/navigation";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FallbackContentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT title, fallback_content 
       FROM resources 
       WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) notFound();

    const { title, fallback_content } = result.rows[0];

    return (
      <div className="min-h-screen bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-teal-600 text-white py-8 px-10">
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          <div className="p-10 prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {fallback_content ? (
              <div dangerouslySetInnerHTML={{ __html: fallback_content.replace(/\n/g, "<br />") }} />
            ) : (
              <p className="text-gray-500 italic">
                No content available for this resource at the moment.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading fallback content:", error);
    notFound();
  } finally {
    client.release();
  }
}
