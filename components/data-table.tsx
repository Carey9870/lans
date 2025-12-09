// components/data-table.tsx
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
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [flashingRows, setFlashingRows] = React.useState<Set<string>>(new Set());

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    pageCount: Math.ceil(data.length / 13),
    manualPagination: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

// Inside DataTable.tsx – Perfect solution (no warnings, works perfectly)
const rowSelected = table.getState().rowSelection;
const prevRowSelectionRef = React.useRef<Record<string, boolean>>(rowSelected);

React.useEffect(() => {
  const currentSelection = table.getState().rowSelection;
  const prevSelection = prevRowSelectionRef.current;

  const newlySelectedIds = Object.keys(currentSelection).filter(
    (id) => currentSelection[id] && !prevSelection[id]
  );

  if (newlySelectedIds.length > 0) {
    setFlashingRows((prev) => {
      const next = new Set(prev);
      newlySelectedIds.forEach((id) => next.add(id));
      return next;
    });

    const timer = setTimeout(() => {
      setFlashingRows((prev) => {
        const next = new Set(prev);
        newlySelectedIds.forEach((id) => next.delete(id));
        return next;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }

  // Update ref for next render
  prevRowSelectionRef.current = currentSelection;
}, [rowSelection, table]); // Only depend on the actual state value

  // Alternating row colors matching your design
  const rowBgClasses = [
    "bg-gray-50",
    "bg-blue-50",
    "bg-gray-100",
    "bg-purple-50",
    "bg-gray-50",
    "bg-blue-50",
    "bg-gray-100",
    "bg-purple-50",
    "bg-gray-50",
    "bg-blue-50",
  ];

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Ardhi Forms</h1>
        <p className="text-sm text-gray-600">— CLA Forms, LRA Forms, Sectional Properties Forms</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md ml-auto">
        <Search className="absolute text-black left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
        <Input
          placeholder="Search forms..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-200 hover:bg-gray-200">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-700 font-semibold uppercase text-xs">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const globalIndex = table.getState().pagination.pageIndex * 13 + index;
                const bgClass = rowBgClasses[globalIndex % rowBgClasses.length];
                const isFlashing = flashingRows.has(row.id);
                const isSelected = row.getIsSelected();

                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected && "selected"}
                    className={`
                      border-b transition-all duration-300
                      ${isSelected ? "bg-amber-200 ring-2 ring-amber-500 ring-offset-2" : bgClass}
                      ${isFlashing ? "animate-flash-amber" : ""}
                      hover:brightness-95
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  No forms found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-600">
          Showing {table.getState().pagination.pageIndex * 13 + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * 13, data.length)} of{" "}
          {table.getFilteredRowModel().rows.length} entries
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}