// app/admin/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit2, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "Category title is required"),
  items: z.array(
    z.object({
      title: z.string().min(1, "Service title is required"),
      description: z.string().optional(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;
type Category = {
  id: number;
  title: string;
  slug: string;
  items: { id: number; title: string; description: string | null; number: number }[];
};

export default function AdminServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      items: [{ title: "", description: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Load all categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/services");
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setFetching(false);
      }
    }
    loadCategories();
  }, []);

  // Start editing a category
  function startEdit(category: Category) {
    setEditingId(category.id);
    form.setValue("title", category.title);
    replace(
      category.items.map((item) => ({
        title: item.title,
        description: item.description || "",
      }))
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    form.reset();
  }

  // Submit (create or update)
  async function onSubmit(data: FormData) {
    setLoading(true);

    const payload = {
      title: data.title,
      items: data.items.map((item, i) => ({
        title: item.title,
        description: item.description || null,
      })),
    };

    try {
      const url = editingId
        ? `/api/admin/services/${editingId}`
        : "/api/admin/services";

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed");

      toast.success(
        editingId
          ? "Category updated successfully!"
          : "Category created successfully!"
      );

      // Refresh list
      const refreshed = await fetch("/api/admin/services");
      const refreshedData = await refreshed.json();
      setCategories(refreshedData);

      form.reset();
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">
        Admin: Manage Services
      </h1>

      {/* Create / Edit Form */}
      <Card className="mb-12 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {editingId ? "Edit Category" : "Create New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="block text-lg font-medium mb-2">Category Title</label>
              <Input
                {...form.register("title")}
                placeholder="e.g. Land Registration Services"
                className="text-lg"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Services</h3>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-6 bg-gray-50 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-primary">
                      {index + 1})
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <Input
                    {...form.register(`items.${index}.title`)}
                    placeholder="Service Title"
                  />
                  <Textarea
                    {...form.register(`items.${index}.description`)}
                    placeholder="Description (optional)"
                    rows={3}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: "", description: "" })}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" size="lg" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : editingId ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List of Categories */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Existing Categories</h2>

        {fetching ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No categories yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="relative group">
                <CardHeader>
                  <CardTitle className="text-xl pr-12">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.items.length} service{category.items.length !== 1 ? "s" : ""}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {category.items.slice(0, 4).map((item) => (
                      <li key={item.id} className="truncate">
                        {item.number}. {item.title}
                      </li>
                    ))}
                    {category.items.length > 4 && (
                      <li className="text-gray-500">... and {category.items.length - 4} more</li>
                    )}
                  </ul>
                </CardContent>

                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEdit(category)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}