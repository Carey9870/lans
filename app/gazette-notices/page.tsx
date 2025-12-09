// app/gazette-notices/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

async function fetchNotices(search?: string) {
  const url = search
    ? `/api/gazette-notices?search=${encodeURIComponent(search)}`
    : "/api/gazette-notices";
  const res = await fetch(url);
  return res.json();
}

export default function GazetteNoticesPage() {
  const [search, setSearch] = useState("");
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["gazette-notices", search],
    queryFn: () => fetchNotices(search),
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Gazette Notices</h1>

      <div className="max-w-md mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search by reference or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="w-10 h-10" />
        </div>
      ) : (
        <ol className="space-y-4">
          {notices.map((notice: any, index: number) => (
            <li key={notice.id}>
              <Link
                href={`/gazette-notices/${notice.slug}`}
                className="block p-6 border rounded-lg hover:bg-accent transition"
              >
                <span className="font-medium text-primary mr-3">{index + 1}.</span>
                <span className="font-medium hover:underline">{notice.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      {notices.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground py-10">No notices found.</p>
      )}
    </div>
  );
}