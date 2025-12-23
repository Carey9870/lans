// components/tenders/data-table.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  Table as TanStackTable,
  PaginationState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageCount?: number;
  onPageChange?: (pageIndex: number) => void;
  rowClassName?: (row: Row<TData>, index: number) => string;
  isLoading?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  pageCount: controlledPageCount,
  onPageChange,
  rowClassName,
  isLoading = false,
}: DataTableProps<TData>) {
  // Properly manage pagination state
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  // Sync external page changes
  React.useEffect(() => {
    if (onPageChange && controlledPageCount) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [controlledPageCount, onPageChange]);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: controlledPageCount ?? undefined,
    manualPagination: !!controlledPageCount,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
    },
  });

  const currentPageCount = controlledPageCount ?? table.getPageCount();

  const handlePrevious = () => {
    const newIndex = pageIndex - 1;
    setPagination((prev) => ({ ...prev, pageIndex: newIndex }));
    onPageChange?.(newIndex + 1); // Convert to 1-based for API
  };

  const handleNext = () => {
    const newIndex = pageIndex + 1;
    setPagination((prev) => ({ ...prev, pageIndex: newIndex }));
    onPageChange?.(newIndex + 1); // Convert to 1-based for API
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={rowClassName?.(row, index)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {currentPageCount > 1 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Page {pageIndex + 1} of {currentPageCount}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={pageIndex >= currentPageCount - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

