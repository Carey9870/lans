// app/media-center/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

// Proper type instead of `any`
interface MediaItem {
  id: number;
  title: string;
  slug: string;
  date: string; // ISO string from DB
  preview_image: string;
}

const PAGE_SIZE = 8;

async function fetchMedia(page: number) {
  const res = await fetch(`/api/media?page=${page}&limit=${PAGE_SIZE}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function fetchMediaTotal() {
  const res = await fetch("/api/media?count=true");
  if (!res.ok) throw new Error("Failed to fetch total");
  const data = await res.json();
  return data.total;
}

export default function MediaCenterPage() {
  // Always call these hooks at the top level
  const {
    data: totalData,
    isLoading: totalLoading,
    error: totalError,
  } = useQuery({
    queryKey: ["media-total"],
    queryFn: fetchMediaTotal,
  });

  const total = totalData ?? 0;
  const usePagination = total > 20;

  // State for pagination mode
  const [currentPage, setCurrentPage] = useState(1);

  // Infinite query — always defined (but conditionally enabled)
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["media-infinite"],
    queryFn: ({ pageParam = 1 }) => fetchMedia(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return (lastPage.page || 1) + 1;
    },
    initialPageParam: 1,
    enabled: !usePagination && !totalLoading, // only run when we should
  });

  // Regular paginated query — always defined
  const paginatedQuery = useQuery({
    queryKey: ["media-paged", currentPage],
    queryFn: () => fetchMedia(currentPage),
    enabled: usePagination && !totalLoading,
  });

  // Show full-page spinner while loading total count
  if (totalLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (totalError) {
    return (
      <div className="flex items-center justify-center py-10 text-red-500">
        <Spinner />
        Error loading media - because there is no database, but media center is
        done. - now implemet it on home news and events
      </div>
    );
  }

  // Decide which data to use
  const isLoading = usePagination
    ? paginatedQuery.isLoading
    : infiniteQuery.isLoading;
  const isFetchingNext = infiniteQuery.isFetchingNextPage;

  const items: MediaItem[] = usePagination
    ? paginatedQuery.data?.data || []
    : infiniteQuery.data?.pages.flatMap((p) => p.data) ?? [];

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasNextPage = usePagination
    ? currentPage < totalPages
    : infiniteQuery.hasNextPage;

  // Shared loading spinner for content
  if (isLoading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-3xl font-bold mb-6 text-start font-serif">Media Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/media-center/${item.slug}`}
            className="block"
          >
            <Card className="overflow-hidden bg-gray-50 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <CardHeader className="p-0">
                <div className="relative flex justify-center items-center aspect-video">
                  <Image
                    src={item.preview_image}
                    alt={item.title}
                    height={300}
                    width={300}
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(item.date), "dd MMM, yyyy")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More Button (only when ≤20 items total) */}
      {!usePagination && hasNextPage && (
        <div className="mt-12 text-center">
          <Button
            onClick={() => infiniteQuery.fetchNextPage()}
            disabled={isFetchingNext}
            size="lg"
          >
            {isFetchingNext ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* Pagination (only when >20 items) */}
      {usePagination && totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 10) pageNum = i + 1;
                else if (currentPage <= 6) pageNum = i + 1;
                else if (currentPage > totalPages - 5)
                  pageNum = totalPages - 9 + i;
                else pageNum = currentPage - 5 + i;
                return pageNum;
              }).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={pageNum === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}


