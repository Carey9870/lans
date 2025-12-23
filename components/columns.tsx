// components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Form } from "@/lib/types";

// Safe formatSize – works with number, string, null, undefined
function formatSize(kb: number | string | null | undefined): string {
  if (kb === null || kb === undefined || kb === "") return "—";

  // Convert anything to a valid number
  const num = typeof kb === "string" ? parseFloat(kb) : Number(kb);

  // If it's not a valid number, return dash
  if (isNaN(num) || num < 0) return "—";

  // Format
  return num >= 1000 ? `${(num / 1024).toFixed(2)} MB` : `${num.toFixed(2)} KB`;
}

export const columns: ColumnDef<Form>[] = [
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
    accessorKey: "sno",
    header: "SNo.",
    cell: ({ row }) => <div className="font-medium">{row.getValue("sno")}</div>,
  },
  {
    accessorKey: "form_number",
    header: "Form Number",
    cell: ({ row }) => (
      <div className="font-semibold text-blue-700">
        {row.getValue("form_number")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Form Description",
  },
  {
    accessorKey: "category",
    header: "Form Category",
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "pdf_filename",
    header: "Download Link",
    // In your DataTable column
    cell: ({ row }) => {
      const form = row.original;
      const hasFile = !!form.pdf_filename;
      const sizeStr = formatSize(form.pdf_size_kb);
      const slug = form.form_number.replace(/\s+/g, "-").toLowerCase();

      if (!hasFile) {
        return <span className="text-gray-400 italic">No file</span>;
      }

      return (
        <a
          href={`/api/download?slug=${slug}`}
          download
          className="font-medium text-blue-600 hover:underline"
        >
          {form.form_number} ({sizeStr})
        </a>
      );
    },
  },
];
