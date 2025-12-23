import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { query } from "@/lib/db";
import type { Form } from "@/lib/types";

async function getForms(): Promise<Form[]> {
  const res = await query("SELECT * FROM forms ORDER BY sno ASC");
  return res.rows;
}

export default async function FormsPage() {
  const forms = await getForms();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <DataTable columns={columns} data={forms} />
      </div>
    </main>
  );
}