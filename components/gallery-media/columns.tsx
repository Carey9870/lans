// components/gallery-media/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteMediaDialog from "./delete-media-dialog";
import EditableCell from "./editable-cell";

export type GalleryMedia = {
  id: number;
  type: "IMAGE" | "VIDEO";
  title: string | null;
  text: string | null;           // Main caption under image/video
  subtext: string | null;        // Smaller line below
  file_path: string;
  thumbnail_path: string | null;
  duration_seconds: number | null;
  order: number;
  created_at?: string;
  updated_at?: string;
};


export const columns: ColumnDef<GalleryMedia>[] = [
  {
    id: "drag",
    cell: () => <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />,
    size: 40,
  },
  {
    accessorKey: "thumbnail_path",
    header: "Preview",
    cell: ({ row }) => {
      const media = row.original;
      const src = media.thumbnail_path || media.file_path;

      return (
        <div className="relative w-20 h-14 rounded overflow-hidden border">
          {media.type === "VIDEO" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="bg-white rounded-full p-1">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </div>
            </div>
          )}
          <Image
            src={src}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.title || <span className="text-muted-foreground italic">No title</span>}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.original.type === "VIDEO" ? "default" : "secondary"}>
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "duration_seconds",
    header: "Duration",
    cell: ({ row }) =>
      row.original.duration_seconds ? `${row.original.duration_seconds}s` : "—",
  },
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => <Badge variant="outline">{row.original.order + 1}</Badge>,
  },
  // In your columns.tsx
{
  accessorKey: "text",
  header: "Main Caption",
  cell: ({ row }) => {
    const media = row.original;
    return (
      <EditableCell
        value={media.text || ""}
        onSave={(newText) => {
          fetch(`/api/gallery/${media.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newText }),
          }).then(() => {
            // Optional: trigger refresh or optimistic update
            window.location.reload(); // or use router.refresh()
          });
        }}
      />
    );
  },
},
{
  accessorKey: "subtext",
  header: "Subtext",
  cell: ({ row }) => {
    const media = row.original;
    return (
      <EditableCell
        value={media.subtext || ""}
        placeholder="e.g. CEO • Since 2020"
        onSave={(newSubtext) => {
          fetch(`/api/gallery/${media.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subtext: newSubtext }),
          });
        }}
      />
    );
  },
},
  {
    id: "actions",
    cell: ({ row }) => {
      const media = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a href={`/admin/gallery/edit/${media.id}`} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <DeleteMediaDialog id={media.id} title={media.title || "this media"} />
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];