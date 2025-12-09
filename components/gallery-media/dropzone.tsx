// components/gallery-media/dropzone.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileVideo, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface DropzoneProps {
  onFilesChange: (files: File[], text: string, subtext: string) => void;
  className?: string;
}

export default function Dropzone({ onFilesChange, className }: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [sharedText, setSharedText] = useState("");
  const [sharedSubtext, setSharedSubtext] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback((acceptedFiles: File[]) => {
    const validTypes = ["image/jpeg","image/png","image/webp","video/mp4","video/quicktime","video/webm"];
    const maxSize = 100 * 1024 * 1024;
    const maxFiles = 12;

    if (acceptedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return false;
    }

    for (const file of acceptedFiles) {
      if (!validTypes.includes(file.type)) { setError(`Invalid type: ${file.name}`); return false; }
      if (file.size > maxSize) { setError(`Too large: ${file.name}`); return false; }
    }

    setError(null);
    return true;
  }, [files.length]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!validateFiles(acceptedFiles)) return;

    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles, sharedText, sharedSubtext);
  }, [files, sharedText, sharedSubtext, onFilesChange, validateFiles]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles, sharedText, sharedSubtext);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg",".jpeg",".png",".webp"], "video/*": [".mp4",".mov",".webm"] },
    multiple: true,
  });

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          className
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl font-medium">Drop files here or click to browse</p>
        <p className="text-sm text-muted-foreground mt-2">
          Images & videos • Max 12 files • 100MB each
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <>
          {/* Shared Caption */}
          <div className="p-6 border rounded-xl bg-card space-y-5">
            <h3 className="font-semibold text-lg">Caption for all items</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Caption</Label>
                <Input
                  placeholder="e.g. Our Leadership Team 2025"
                  value={sharedText}
                  onChange={(e) => {
                    setSharedText(e.target.value);
                    onFilesChange(files, e.target.value, sharedSubtext);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Subtext</Label>
                <Input
                  placeholder="e.g. Driving Innovation • Since 2010"
                  value={sharedSubtext}
                  onChange={(e) => {
                    setSharedSubtext(e.target.value);
                    onFilesChange(files, sharedText, e.target.value);
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* File Previews */}
          <div className="space-y-4">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={80}
                    height={60}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-20 h-16 bg-black rounded flex items-center justify-center">
                    <FileVideo className="h-10 w-10 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}