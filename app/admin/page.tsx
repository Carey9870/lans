// app/admin/page.tsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { AdminAuthWrapper } from "@/components/auth/admin-auth-wrapper";

function AuthenticatedDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Admin Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You are successfully logged in as an administrator.
        </p>

        {/* Your real admin UI/content goes here */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <p className="text-muted-foreground">View and edit admin users.</p>
          </div>
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">System Logs</h2>
            <p className="text-muted-foreground">Monitor recent activities.</p>
          </div>
        </div>

        {/* Logout Form (Server Action for security) */}
        <form action="/api/auth/logout" method="post" className="mt-8">
          <button
            type="submit"
            className="rounded-md bg-destructive px-4 py-2 font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Early return for no token (no try/catch needed)
  if (!token) {
    return <AdminAuthWrapper />;
  }

  // Validate token OUTSIDE of any JSX/render — only logic here
  let isValidToken = false;
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    isValidToken = true;
  } catch (error) {
    console.error(`e - ${error}`)
    // Token invalid/expired — log if needed: console.error('Invalid token:', error);
  }

  // Conditional render based on computed value (no JSX in try/catch)
  if (isValidToken) {
    return <AuthenticatedDashboard />;
  }

  // Invalid token → show auth UI
  return <AdminAuthWrapper />;
}

