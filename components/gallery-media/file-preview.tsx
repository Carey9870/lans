// components/gallery-media/file-preview.tsx
"use client";

import { X, FileImage, FileVideo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type FilePreviewProps = {
  file: File & { preview?: string; text?: string; subtext?: string };
  onRemove: () => void;
  onTextChange: (text: string) => void;
  onSubtextChange: (subtext: string) => void;
};

export default function FilePreview({ file, onRemove, onTextChange, onSubtextChange }: FilePreviewProps) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-background">
      {file.type.startsWith("image/") ? (
        <Image
          src={file.preview!}
          alt={file.name}
          width={120}
          height={80}
          className="rounded object-cover"
        />
      ) : (
        <div className="bg-black rounded flex items-center justify-center w-32 h-20">
          <FileVideo className="h-10 w-10 text-white" />
        </div>
      )}

      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
          <button onClick={onRemove} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <Label htmlFor={`text-${file.name}`} className="text-xs">Caption</Label>
          <Input
            id={`text-${file.name}`}
            placeholder="e.g. Leading with Vision"
            defaultValue={file.text || ""}
            onChange={(e) => onTextChange(e.target.value)}
            className="h-8"
          />
        </div>

        <div>
          <Label htmlFor={`subtext-${file.name}`} className="text-xs">Subtext</Label>
          <Input
            id={`subtext-${file.name}`}
            placeholder="e.g. CEO • Since 2015"
            defaultValue={file.subtext || ""}
            onChange={(e) => onSubtextChange(e.target.value)}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}