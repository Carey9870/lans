// components/gallery-media/delete-media-dialog.tsx
"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function DeleteMediaDialog({ id, title }: { id: number; title: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Media</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}