// app/admin/tenders/page.tsx
import { TendersTable } from "@/components/tenders/tenders-table"; 

export default function AdminTenders() {
  return (
    <div className="container py-9">
      <h1 className="text-3xl font-bold ml-10 mb-3">Manage Tenders</h1>
      <TendersTable isAdmin={true} />
    </div>
  );
}

