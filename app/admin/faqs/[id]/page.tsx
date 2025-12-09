// app/admin/faqs/[id]/page.tsx
import EditFAQClient from './edit-faq-client';
import { notFound } from 'next/navigation';

async function getId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0) notFound();
  return num;
}

export default async function EditFAQPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = await getId(params);

  return <EditFAQClient initialId={id} />;
}

