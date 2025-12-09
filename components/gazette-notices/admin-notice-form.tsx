// components/AdminNoticeForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Upload, FileText, ImageIcon, X, Loader2 } from "lucide-react";
import { Tiptap } from "./tiptap"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Resource = {
  type: "image" | "document";
  url: string;
  originalName: string;
  filename: string;
};

type NoticeFormData = {
  title: string;
  content: string;
  resources: Resource[];
};

type Props = {
  initialData?: {
    id?: number;
    title: string;
    content: string;
    resources: Resource[];
  };
};

export default function AdminNoticeForm({ initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [resources, setResources] = useState<Resource[]>(initialData?.resources || []);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const uploadFile = async (file: File): Promise<Resource> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/gazette-notices/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    setIsUploading(false);

    return {
      type: data.type,
      url: data.url,
      originalName: data.originalName,
      filename: data.filename,
    };
  };

  const mutation = useMutation({
    mutationFn: async (data: NoticeFormData) => {
      const method = initialData?.id ? "PUT" : "POST";
      const url = initialData?.id
        ? `/api/gazette-notices/${initialData.id}`
        : "/api/gazette-notices";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gazette-notices"] });
      queryClient.invalidateQueries({ queryKey: ["gazette-notices"] });
      router.push("/admin/gazette-notices");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    mutation.mutate({ title, content, resources });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file);
      setResources((prev) => [...prev, uploaded]);
    } catch (err) {
      alert("Upload failed. Try again.");
    }
  };

  const removeResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit" : "Add New"} Gazette Notice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., PDP Ref. No NRB/339/2025/01 Regularisation..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content (Rich Text Editor)</Label>
            <Tiptap content={content} onChange={setContent} placeholder="Start typing the notice content..." />
          </div>

          <div className="space-y-4">
            <Label>Attached Resources (Images & Documents)</Label>

            {resources.length > 0 && (
              <div className="space-y-2">
                {resources.map((res, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      res.type === "image" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {res.type === "image" ? (
                        <ImageIcon
                          className="h-5 w-5 text-blue-600" 
                        />
                      ) : (
                        <FileText className="h-5 w-5 text-green-600" />
                      )}
                      <div>
                        <p className="font-medium text-sm">
                          {index + 1}. {res.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {res.type === "image" ? "Image" : "Document"} • Clickable link in public view
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <label className="block">
              <Button type="button" variant="outline" disabled={isUploading} asChild>
                <span className="cursor-pointer">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Add Resource (Image / PDF / DOC)
                    </>
                  )}
                </span>
              </Button>
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Notice"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </div>

          {mutation.isError && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to save. Please try again.</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}