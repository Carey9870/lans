// app/admin/forms/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { PdfDropzone } from "@/components/resources/pdf-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit2, Loader2 } from "lucide-react";
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

type Form = {
  id: number;
  sno: number;
  form_number: string;
  description: string;
  category: string;
  pdf_filename: string | null;
  pdf_size_kb: number | null;
};

function formatSize(kb: number | string | null): string {
  if (kb === null || kb === undefined || kb === "") return "—";

  // Convert to number safely
  const size = typeof kb === "string" ? parseFloat(kb) : Number(kb);

  // If conversion failed or is not a valid number
  if (isNaN(size) || size < 0) return "—";

  return size >= 1000
    ? `${(size / 1024).toFixed(2)} MB`
    : `${size.toFixed(2)} KB`;
}

export default function AdminFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch forms
  useEffect(() => {
    fetch("/api/forms")
      .then((res) => res.json())
      .then((data) => {
        setForms(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load forms");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (file) {
      formData.set("file", file);
    }

    const isEdit = editingId !== null;
    const url = isEdit ? `/api/forms/${editingId}` : "/api/forms";

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success(isEdit ? "Form updated" : "Form created");
        setEditingId(null);
        setFile(null);
        const updated = await fetch("/api/forms").then((r) => r.json());
        setForms(updated);
        (e.target as HTMLFormElement).reset();
      } else {
        const error = await res.text();
        toast.error(error || "Failed to save");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/forms/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setForms(forms.filter((f) => f.id !== deleteId));
        toast.success("Form deleted successfully");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeleteId(null);
    }
  };

  const startEdit = (form: Form) => {
    setEditingId(form.id);
    setFile(null); // clear previous file

    // Fill form fields
    (document.getElementById("sno") as HTMLInputElement).value = String(form.sno);
    (document.getElementById("form_number") as HTMLInputElement).value = form.form_number;
    (document.getElementById("description") as HTMLInputElement).value = form.description;
    (document.getElementById("category") as HTMLInputElement).value = form.category;
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFile(null);
    (document.querySelector("form") as HTMLFormElement)?.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Admin – Manage Forms</h1>
          <p className="mt-2 text-gray-600">Add, edit, or remove Ardhi forms</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sno">SNo.</Label>
              <Input id="sno" name="sno" type="number" required min="1" />
            </div>
            <div>
              <Label htmlFor="form_number">Form Number</Label>
              <Input id="form_number" name="form_number" required placeholder="FORM CLA-1" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" required placeholder="CLA forms" />
            </div>
            <div className="md:col-span-2">
              <Label>PDF File (optional - replaces existing)</Label>
              <div className="mt-2">
                <PdfDropzone
                  onFileAccepted={setFile}
                  currentFileName={file?.name}
                  className="border-2 border-dashed border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                "Update Form"
              ) : (
                "Add New Form"
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Existing Forms ({forms.length})</h2>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
            </div>
          ) : forms.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No forms added yet.</p>
          ) : (
            <div className="grid gap-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
                >
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">{form.form_number}</p>
                    <p className="text-gray-600">{form.description}</p>
                    <p className="text-sm text-gray-500">
                      {form.pdf_filename
                        ? `File uploaded • ${formatSize(form.pdf_size_kb)}`
                        : "No file uploaded"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline" onClick={() => startEdit(form)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => confirmDelete(form.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this form? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}