// app/admin/tenders/[id]/edit/page.tsx
import EditTenderForm from "@/components/tenders/edit-tender-form"

export const dynamic = "force-dynamic";

export default async function EditTenderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenderId = parseInt(id, 10);

  if (isNaN(tenderId)) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold text-destructive">Invalid Tender ID</h1>
        <p className="text-muted-foreground mt-2">The tender ID must be a number.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Edit Tender</h1>
      <p className="text-muted-foreground mb-8">Update the details of this tender</p>
      <EditTenderForm tenderId={tenderId} />
    </div>
  );
}

