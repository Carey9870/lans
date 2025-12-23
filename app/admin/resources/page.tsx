// app/admin/resources/page.tsx
import { AdminResourceManager } from "./admin-resource-manager";

export default async function AdminDashboard() {

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Manage Downloadable Resources
          </h2>
          <AdminResourceManager />
        </div>
      </main>
    </div>
  );
}