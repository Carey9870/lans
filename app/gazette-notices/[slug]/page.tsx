// app/gazette-notices/[slug]/page.tsx
import { notFound } from "next/navigation";

async function getNotice(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/gazette-notices?slug=${slug}`, {
    next: { revalidate: 60 },
  });
  const notices = await res.json();
  return notices.find((n: any) => n.slug === slug);
}

export default async function NoticeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const notice = await getNotice(slug);

  if (!notice) return notFound();

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{notice.title}</h1>

      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />

      {notice.resources && notice.resources.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Attached Resources</h2>
          <ol className="space-y-3">
            {notice.resources.map((res: any, i: number) => (
              <li key={res.id}>
                {res.type === "image" ? (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    ({i + 1}) {res.original_name} (opens in new tab)
                  </a>
                ) : (
                  <a
                    href={res.url}
                    download
                    className="text-primary hover:underline"
                  >
                    ({i + 1}) {res.original_name}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}