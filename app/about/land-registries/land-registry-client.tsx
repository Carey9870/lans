// app/land-registries/LandRegistryClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { LandRegistryTable } from "@/components/land-registry/land-registry"; 
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export function LandRegistryClient() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["land-registries", page],
    queryFn: async () => {
      const res = await fetch(`/api/land-registries?page=${page}`, {
        cache: "no-store", // Important: prevents caching issues in dev
      });
      if (!res.ok) {
        throw new Error("Failed to fetch land registries");
      }
      return res.json();
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error loading data. Please try again later.</p>
      </div>
    );
  }

  return (
    <LandRegistryTable
      data={data?.data || []}
      isLoading={isLoading}
      pagination={data?.pagination || { page: 1, totalPages: 1, total: 0 }}
      onEdit={() => {}}
      onDelete={() => {}}
      isAdmin={false}
    />
  );
}