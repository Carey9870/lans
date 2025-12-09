// app/admin/gazette-notices/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import AdminNoticeForm from "@/components/gazette-notices/admin-notice-form";

async function getNotice(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/gazette-notices/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = await getNotice(id);

  if (!notice) notFound();

  return (
    <div className="container mx-auto py-10">
      <AdminNoticeForm
        initialData={{
          id: notice.id,
          title: notice.title,
          content: notice.content || "",
          resources: notice.resources || [],
        }}
      />
    </div>
  );
}

