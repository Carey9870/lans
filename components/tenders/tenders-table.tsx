"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Kbd } from "@/components/ui/kbd";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { columns } from "@/components/tenders/tender-columns";
import { DataTable } from "@/components/tenders/data-table";

const fetchTenders = async (page: number, search: string, status: string) => {
  const res = await fetch(
    `/api/tenders?page=${page}&search=${search}&status=${status}`
  );
  return res.json();
};

export function TendersTable({ isAdmin }: { isAdmin: boolean }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "closed">("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tenders", page, search, status],
    queryFn: () => fetchTenders(page, search, status),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/tenders/${deleteId}`, { method: "DELETE" });
    queryClient.invalidateQueries({ queryKey: ["tenders"] });
    setDeleteId(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tenders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Kbd className="absolute right-3 top-1/2 -translate-y-1/2">K</Kbd>
          </div>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "all" | "active" | "closed")
            }
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="h-8 w-8" />
          </div>
        ) : data?.tenders.length === 0 ? (
          // NEW: Show friendly message when no tenders match
          <div className="text-center py-20">
            {status === "closed" ? (
              <h1 className="text-2xl font-bold text-muted-foreground">
                No Closed Tenders
              </h1>
            ) : status === "active" ? (
              <h1 className="text-2xl font-bold text-muted-foreground">
                No Active Tenders
              </h1>
            ) : (
              <h1 className="text-2xl font-bold text-muted-foreground">
                No Tenders Found
              </h1>
            )}
            <p className="text-muted-foreground mt-4">
              {search
                ? `No results for "${search}"`
                : status === "closed"
                ? "All tenders are currently active."
                : status === "active"
                ? "There are no active tenders at the moment."
                : "Create your first tender to get started."}
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns(isAdmin, (id) => setDeleteId(id))}
            data={data?.tenders || []}
            pageCount={data?.totalPages || 0}
            onPageChange={setPage}
            rowClassName={(row, index) => {
              const bg = index % 2 === 0 ? "bg-amber-100" : "bg-green-100";
              const isSelected = row.getIsSelected();
              const flash = isSelected
                ? index % 2 === 0
                  ? "animate-pulse bg-fuchsia-200"
                  : "animate-pulse bg-lime-200"
                : "";
              const highlight = isSelected
                ? index % 2 === 0
                  ? "bg-fuchsia-200"
                  : "bg-lime-100"
                : "";
              return `${bg} hover:bg-sky-100 transition-all ${flash} ${highlight}`;
            }}
          />
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tender?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tender.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
