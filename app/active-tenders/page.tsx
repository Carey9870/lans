// app/tenders/page.tsx  -  for users
import { TendersTable } from "@/components/tenders/tenders-table"; 

export default function TendersPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Tenders</h1>
      <TendersTable isAdmin={false} />
    </div>
  );
}

