// components/tender-columns.tsx
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CountdownTimer } from "@/components/tenders/countdown-timer"; 
import { Tender } from "@/types/tender"; 

export const columns = (isAdmin: boolean, onDelete: (id: number) => void): ColumnDef<Tender>[] => [
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
    accessorKey: "id",
    header: "No.",
    cell: ({ row }) => <div className="text-center font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: "tender_no",
    header: "Tender No",
  },
  {
    accessorKey: "description",
    header: "Tender Description",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => format(new Date(row.original.start_date), "dd-MMM-yyyy"),
  },
  {
    accessorKey: "closing_datetime",
    header: "Closing Date",
    cell: ({ row }) => {
      const closing = new Date(row.original.closing_datetime);
      const secondsLeft = row.original.seconds_until_close;

      return (
        <div className="flex flex-col">
          <span>{format(closing, "dd-MMM-yyyy hh:mm a")}</span>
          {secondsLeft && secondsLeft > 0 && secondsLeft <= 1800 && (
            <CountdownTimer seconds={secondsLeft} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "document_name",
    header: "Download",
    cell: ({ row }) => {
      const tender = row.original;
      if (!tender.document_name) return <span className="text-muted-foreground">No file</span>;

      const sizeMB = tender.document_size ? (tender.document_size / (1024 * 1024)).toFixed(2) : "0";
      return (
        <Button asChild variant="outline" size="sm">
          <Link href={`/api/tenders/download/${tender.id}`} target="_blank">
            <Download className="mr-2 h-4 w-4" />
            {tender.document_name} ({sizeMB} MB)
          </Link>
        </Button>
      );
    },
  },
  ...(isAdmin
    ? [
        {
          id: "actions",
          cell: ({ row }) => {
            const tender = row.original;
            return (
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" asChild>
                  <Link href={`/admin/tenders/${tender.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(tender.id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            );
          },
        } as ColumnDef<Tender>,
      ]
    : []),
];