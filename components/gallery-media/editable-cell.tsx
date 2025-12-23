// components/gallery-media/editable-cell.tsx
"use client";

import { useState } from "react";
import { Check, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EditableCellProps = {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
};

export default function EditableCell({ value, onSave, placeholder }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(value);

  const handleSave = () => {
    onSave(input.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInput(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 group">
        <span
          className={`min-h-[1.5em] ${value ? "" : "text-muted-foreground italic"}`}
          onClick={() => setIsEditing(true)}
        >
          {value || placeholder || "Click to add text"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-8 text-sm"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
          if (e.key === "Escape") {
            handleCancel();
          }
        }}
      />
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={handleSave}
      >
        <Check className="h-4 w-4 text-green-600" />
        <span className="sr-only">Save</span>
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={handleCancel}
      >
        <X className="h-4 w-4 text-red-600" />
        <span className="sr-only">Cancel</span>
      </Button>
    </div>
  );
}