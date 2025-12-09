// components/ui/dropzone.tsx
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  className?: string;
  onDrop: (acceptedFiles: File[]) => void;
}

export function Dropzone({ className, onDrop }: DropzoneProps) {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxFiles: 12,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-dashed border-2 border-border rounded-md p-6 text-center cursor-pointer hover:border-primary transition-colors",
        isDragActive && "border-primary bg-primary/10",
        className
      )}
    >
      <input {...getInputProps()} />
      <p className="text-muted-foreground">
        Drag & drop images and videos here, or click to select files. Max 6 images and 6 videos. At least one image required.
      </p>
    </div>
  );
}