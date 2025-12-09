// app/admin/faqs/page.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { TrashIcon, EditIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  answer: z.string().min(1, { message: "Answer is required" }),
});

type FormValues = z.infer<typeof formSchema>;

async function fetchFAQs(page: number) {
  const res = await fetch(`/api/faqs?page=${page}&limit=7`);
  if (!res.ok) throw new Error("Failed to fetch FAQs");
  return res.json();
}

async function createFAQ(data: FormValues) {
  const res = await fetch("/api/faqs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create FAQ");
  return res.json();
}

async function updateFAQ(id: number, data: FormValues) {
  const res = await fetch(`/api/faqs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update FAQ");
  return res.json();
}

async function deleteFAQ(id: number) {
  const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete FAQ");
  return res.json();
}

export default function AdminFAQsPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<{
    id: number;
    question: string;
    answer: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["faqs", page],
    queryFn: () => fetchFAQs(page),
  });

  const createMutation = useMutation({
    mutationFn: createFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormValues }) =>
      updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setIsEditDialogOpen(false);
      setEditingFAQ(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "", answer: "" },
  });

  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "", answer: "" },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values);
    form.reset();
  };

  const onEditSubmit = (values: FormValues) => {
    if (editingFAQ) {
      updateMutation.mutate({ id: editingFAQ.id, data: values });
    }
  };

  const handleEdit = (faq: {
    id: number;
    question: string;
    answer: string;
  }) => {
    setEditingFAQ(faq);
    editForm.reset({ question: faq.question, answer: faq.answer });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading FAQs: {(error as Error).message}
      </div>
    );
  }

  const { faqs, totalPages } = data;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage FAQs</h1>

      {/* Add New FAQ Form */}
      <FieldSet className="mb-8">
        <FieldLegend>Add New FAQ</FieldLegend>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="question">Question</FieldLabel>
              <Input id="question" {...form.register("question")} />
              {form.formState.errors.question && (
                <FieldError>
                  {form.formState.errors.question.message}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="answer">Answer</FieldLabel>
              <Input id="answer" {...form.register("answer")} />
              {form.formState.errors.answer && (
                <FieldError>{form.formState.errors.answer.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Spinner className="mr-2 size-4" />
            ) : null}
            Add FAQ
          </Button>
        </form>
      </FieldSet>

      {/* FAQs Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq: { id: number; question: string; answer: string }) => (
            <TableRow key={faq.id}>
              <TableCell>{faq.question}</TableCell>
              <TableCell>{faq.answer}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(faq)}
                >
                  <EditIcon className="size-4" />
                </Button>
                <AlertDialog
                  open={deleteId !== null}
                  onOpenChange={(open) => !open && setDeleteId(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(faq.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="size-4" />
                      <span className="sr-only">Delete FAQ {faq.id}</span>
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogPortal>
                    <AlertDialogOverlay className="bg-gray-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the FAQ:
                          <span className="font-medium">{faq.question}</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (deleteId) {
                              deleteMutation.mutate(deleteId);
                              setDeleteId(null);
                            }
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-blue/90"
                        >
                          {deleteMutation.isPending ? (
                            <>
                              <Spinner className="mr-2 size-4" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogPortal>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {faqs.length === 0 && (
        <p className="text-center mt-4">No FAQs available.</p>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-question">Question</FieldLabel>
                <Input id="edit-question" {...editForm.register("question")} />
                {editForm.formState.errors.question && (
                  <FieldError>
                    {editForm.formState.errors.question.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-answer">Answer</FieldLabel>
                <Input id="edit-answer" {...editForm.register("answer")} />
                {editForm.formState.errors.answer && (
                  <FieldError>
                    {editForm.formState.errors.answer.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Spinner className="mr-2 size-4" />
              ) : null}
              Update FAQ
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
