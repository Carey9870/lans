// app/admin/gallery/upload/client-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/gallery-media/dropzone";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function UploadForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [subtext, setSubtext] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesChange = (newFiles: File[], newText: string, newSubtext: string) => {
    setFiles(newFiles);
    setText(newText);
    setSubtext(newSubtext);
  };

  const upload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));
    formData.append("text", text);
    formData.append("subtext", subtext);

    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/gallery");
        router.refresh();
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setIsUploading(false);
    }

    
  };

  return (
    <div className="space-y-8">
      <Dropzone onFilesChange={handleFilesChange} />

      {files.length > 0 && (
        <div className="space-y-4">
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading {files.length} file{files.length > 1 ? "s" : ""}...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={upload} disabled={isUploading} size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              {isUploading ? "Uploading..." : `Upload ${files.length} Item${files.length > 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}