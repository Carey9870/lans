// components/land-registry-table.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2 } from "lucide-react";
import { LandRegistry } from "@/types/land-registries";

const colors = [
  "bg-blue-100 border-blue-300",
  "bg-green-100 border-green-300",
  "bg-purple-100 border-purple-300",
  "bg-pink-100 border-pink-300",
  "bg-yellow-100 border-yellow-300",
  "bg-indigo-100 border-indigo-300",
  "bg-red-100 border-red-300",
];

interface DataTableProps {
  data: LandRegistry[];
  isLoading: boolean;
  pagination: {
    page: number;
    totalPages: number;
  };
  onEdit: (item: LandRegistry) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean; // ← NEW PROP
}

export function LandRegistryTable({
  data,
  isLoading,
  pagination,
  onEdit,
  onDelete,
  isAdmin,
}: DataTableProps) {
  const router = useRouter();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [flashingRows, setFlashingRows] = useState<Set<number>>(new Set());
  const highlightedRowsRef = useRef<Map<number, string>>(new Map());

  // This effect triggers flashing + color assignment when selection changes
  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map(Number);
    const newFlashing = new Set<number>();
    const newColors = new Map<number, string>(highlightedRowsRef.current);

    selectedIds.forEach((id, index) => {
      if (!highlightedRowsRef.current.has(id)) {
        newFlashing.add(id);
      }
      newColors.set(id, colors[index % colors.length]);
    });

    highlightedRowsRef.current.forEach((_, id) => {
      if (!selectedIds.includes(id)) {
        newColors.delete(id);
      }
    });

    highlightedRowsRef.current = newColors;

    if (newFlashing.size > 0) {
      setFlashingRows(newFlashing);
      const timer = setTimeout(() => setFlashingRows(new Set()), 5000);
      return () => clearTimeout(timer);
    }
  }, [rowSelection]); // Only depend on rowSelection

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(`?page=${page}`, { scroll: false });
    },
    [router]
  );

  const columns: ColumnDef<LandRegistry>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "serial_no",
      header: "S/No.",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.serial_no}</div>
      ),
    },
    {
      accessorKey: "county",
      header: "County",
    },
    {
      accessorKey: "station",
      header: "Station",
    },
    {
      accessorKey: "locations",
      header: "Location & Departments",
      cell: ({ row }) => (
        <div className="space-y-4 max-w-3xl">
          {row.original.locations.map((loc, i) => (
            <div key={i} className="border-l-4 border-red-500 pl-4">
              <p className="text-sm font-medium text-foreground">
                {loc.location}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {loc.departments
                  .split(",")
                  .map((d) => d.trim())
                  .filter(Boolean)
                  .map((dept, j) => (
                    <Badge key={j} className="bg-amber-100" variant="secondary">
                      {dept}
                    </Badge>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },

    ...(isAdmin
      ? [
          {
            id: "actions",
            cell: ({ row }: any) => (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(row.original)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(row.original.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedCount = Object.keys(rowSelection).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      {selectedCount > 0 && (
        <div className="mb-4 text-sm font-medium text-muted-foreground">
          {selectedCount} row{selectedCount > 1 ? "s" : ""} selected
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const bgColor = highlightedRowsRef.current.get(row.original.id);
                const isFlashing = flashingRows.has(row.original.id);

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`transition-all duration-300 ${
                      isFlashing ? "animate-pulse" : ""
                    } ${bgColor || ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No land registries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                pagination.page > 1 && handlePageChange(pagination.page - 1)
              }
              className={
                pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={pageNum === pagination.page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                pagination.page < pagination.totalPages &&
                handlePageChange(pagination.page + 1)
              }
              className={
                pagination.page >= pagination.totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
