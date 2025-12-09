// app/admin/gazette-notices/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Edit, Plus } from "lucide-react";

const fetchNotices = () => fetch("/api/gazette-notices").then(res => res.json());

export default function AdminGazetteNotices() {
  const queryClient = useQueryClient();
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["admin-gazette-notices"],
    queryFn: fetchNotices,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/gazette-notices/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-gazette-notices"] }),
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin – Gazette Notices</h1>
        <Link href="/admin/gazette-notices/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Notice
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4">
          {notices.map((notice: any) => (
            <div key={notice.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-medium">{notice.title}</p>
                <p className="text-sm text-muted-foreground">Slug: {notice.slug}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/gazette-notices/edit/${notice.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(notice.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}