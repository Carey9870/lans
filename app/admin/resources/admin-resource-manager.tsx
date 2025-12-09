// components/admin/AdminResourceManager.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, 
  Plus, 
  Edit2, 
  Save, 
  X, Loader2 } from "lucide-react";
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PdfDropzone } from "@/components/resources/pdf-dropzone"; 

interface Section {
  id: number;
  title: string;
  slug: string;
  order: number;
  links: Resource[];
}

interface Resource {
  id: number;
  title: string;
  slug: string;
  pdf_filename: string | null;
  fallback_content: string;
  order: number;
}

export function AdminResourceManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/resources");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSections(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load resources. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const saveResource = async (resourceId: number, formData: FormData) => {
    await fetch(`/api/admin/resources/${resourceId}`, {
      method: "PUT",
      body: formData,
    });
    fetchSections();
  };

  // Inside AdminResourceManager.tsx — replace the existing deleteResource function

  const deleteResource = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this resource?\nThis will also delete the PDF file if uploaded."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/resources/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchSections(); // Refresh the list
      } else {
        const error = await res.text();
        alert("Delete failed: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-xl text-gray-600">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <Card key={section.id} className="overflow-hidden shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-600 to-teal-600 text-white">
            <CardTitle className="text-2xl font-semibold">
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            {section.links.map((resource) => (
              <ResourceForm
                key={resource.id}
                resource={resource}
                onSave={saveResource}
                onDelete={deleteResource}
              />
            ))}
            <AddNewResource sectionId={section.id} onAdd={fetchSections} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Edit Existing Resource Form
function ResourceForm({
  resource,
  onSave,
  onDelete,
}: {
  resource: Resource;
  onSave: (id: number, data: FormData) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(resource.title);
  const [slug, setSlug] = useState(resource.slug);
  const [fallback, setFallback] = useState(resource.fallback_content);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false); // ← NEW STATE

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("fallbackContent", fallback);
    formData.append("existingPdf", resource.pdf_filename || "");
    if (file) formData.append("pdf", file);

    try {
      await onSave(resource.id, formData);
      setEditing(false);
    } catch (err) {
      alert("Save failed. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(resource.id);
    } finally {
      setDeleting(false);
    }
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (editing && title) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(autoSlug);
    }
  }, [title, editing]);

  return (
    <div className="border rounded-xl p-6 space-y-5 bg-gray-50 hover:bg-gray-100 transition">
      {editing ? (
        <>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource Title"
            className="text-lg font-medium"
          />
          <Input
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            placeholder="slug (auto-generated)"
            className="font-mono"
          />
          <Textarea
            value={fallback}
            onChange={(e) => setFallback(e.target.value)}
            placeholder="Fallback content if no PDF is uploaded..."
            rows={4}
            className="resize-none"
          />
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              PDF Document (optional)
            </p>
            <PdfDropzone
              onFileAccepted={setFile}
              currentFileName={resource.pdf_filename || undefined}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(false)}
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-semibold text-lg text-gray-900">
              {resource.title}
            </h4>
            <p className="text-sm font-mono text-gray-600">/{resource.slug}</p>
            {resource.pdf_filename ? (
              <p className="text-sm text-green-600 font-medium">
                PDF: {resource.pdf_filename}
              </p>
            ) : (
              <p className="text-sm text-amber-600 font-medium">
                No PDF — showing fallback text
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={deleting}>
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {resource.title}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the resource
                    <span className="font-semibold text-red-600">
                      {" "}
                      {resource.title}
                    </span>
                    {resource.pdf_filename && " and its PDF file"} from the
                    database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete Permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}

// FULLY WORKING "Add New Resource" Form
function AddNewResource({
  sectionId,
  onAdd,
}: {
  sectionId: number;
  onAdd: () => void;
}) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [fallback, setFallback] = useState(
    "No media uploaded for this resource."
  );
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto-generate slug
  useEffect(() => {
    if (title) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(autoSlug);
    }
  }, [title]);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("sectionId", String(sectionId));
    formData.append("title", title);
    formData.append(
      "slug",
      slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    );
    formData.append("fallbackContent", fallback);
    if (file) formData.append("pdf", file);

    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setTitle("");
        setSlug("");
        setFallback("No media uploaded for this resource.");
        setFile(null);
        setShow(false);
        onAdd();
      } else {
        const error = await res.text();
        alert("Failed to create: " + error);
      }
    } catch (err) {
      alert("Network error. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (!show) {
    return (
      <Button
        onClick={() => setShow(true)}
        variant="outline"
        className="w-full py-6 text-lg"
      >
        <Plus className="w-5 h-5 mr-3" />
        Add New Resource
      </Button>
    );
  }

  return (
    <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 bg-blue-50 space-y-6">
      <h3 className="text-xl font-bold text-blue-900">Create New Resource</h3>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter resource title (e.g., The Land Amendment Act 2025)"
        className="text-lg"
        autoFocus
      />

      <Input
        value={slug}
        onChange={(e) =>
          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
        }
        placeholder="slug (auto-generated)"
        className="font-mono"
      />

      <Textarea
        value={fallback}
        onChange={(e) => setFallback(e.target.value)}
        placeholder="Fallback message when no PDF is uploaded"
        rows={4}
      />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Upload PDF (optional)
        </p>
        <PdfDropzone onFileAccepted={setFile} currentFileName={null} />
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={handleCreate} disabled={saving || !title.trim()}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Resource
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShow(false)}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
