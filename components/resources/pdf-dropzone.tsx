"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface PdfDropzoneProps {
  onFileAccepted: (file: File | null) => void;
  currentFileName?: string | null;
  className?: string;
}

export function PdfDropzone({ onFileAccepted, currentFileName, className }: PdfDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        onFileAccepted(selectedFile);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    onFileAccepted(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop the PDF here...</p>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700">
              Drag & drop a PDF here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-2">Only one .pdf file allowed</p>
          </>
        )}
      </div>

      {(file || currentFileName) && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                {file?.name || currentFileName}
              </p>
              <p className="text-sm text-green-600">
                {file && `${(file.size / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
          </div>
          {file && (
            <button
              onClick={removeFile}
              className="text-red-600 hover:text-red-800 transition"
            >
              <X className="w-5 h-5" />
              {/* comment */}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

