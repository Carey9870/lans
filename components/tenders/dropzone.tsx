// components/tenders/dropzone.tsx
"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  onFileRemoved: () => void;
  file: File | null;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export function Dropzone({
  onFileAccepted,
  onFileRemoved,
  file,
  accept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  },
  maxSize = 50 * 1024 * 1024, // 50MB
  className,
}: DropzoneProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/5 hover:bg-muted/10",
          className
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
        <p className="text-sm text-center px-6">
          {isDragActive ? (
            <span className="font-semibold">Drop the file here...</span>
          ) : (
            <>
              <span className="font-semibold">Click to upload</span> or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          PDF, DOC, DOCX, PPT, PPTX (max 50MB)
        </p>
      </div>

      {file && (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileRemoved();
            }}
            className="text-destructive hover:bg-destructive/10 rounded-full p-2 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}