// app/admin/media/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { CalendarIcon, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Dropzone } from "@/components/media-center/dropzone";

import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().optional(),
  date: z.date({ message: "Date is required" }),
  story: z.string().optional(),
  files: z
    .array(z.instanceof(File))
    .min(1, { message: "At least one file required" })
    .refine((files) => files.some((f) => f.type.startsWith("image/")), {
      message: "At least one image required",
    })
    .refine(
      (files) => files.filter((f) => f.type.startsWith("image/")).length <= 6,
      {
        message: "Maximum 6 images allowed",
      }
    )
    .refine(
      (files) => files.filter((f) => f.type.startsWith("video/")).length <= 6,
      {
        message: "Maximum 6 videos allowed",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminMediaPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      date: new Date(),
      story: "",
      files: [],
    },
  });

  const files = form.watch("files");

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    form.setValue("files", updated, { shouldValidate: true });
  };

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.subtitle) formData.append("subtitle", values.subtitle);
      formData.append("story", values.story || "");
      formData.append("date", values.date.toISOString());

      values.files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Media item created successfully!");
      router.push(`/media-center/${data.slug}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create media item");
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsUploading(true);
    mutation.mutate(values);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Create New Media Item</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Title: <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subtitle (optional) */}
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Subtitle (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subtitle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Date: <span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-60 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        autoFocus
                      />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Story */}
          <FormField
            control={form.control}
            name="story"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Story: <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="border-2 border-black resize-none"
                    rows={10}
                    placeholder="Enter full story..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Files Dropzone */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-bold">
                  Media Files: <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Dropzone
                    className="border-black"
                    onDrop={(files) => field.onChange(files)}
                  />
                </FormControl>
                <FormDescription className="text-black">
                  Uploaded:{" "}
                  <span className="text-red-500">
                    {files?.length || 0} file(s)
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Previews with Remove Button */}
          {files && files.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-bold mb-3">Selected Files:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type.startsWith("image/") ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        height={600}
                        width={600}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-0 right-0 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 shadow-md transition-colors hover:cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs text-center mt-2 truncate block">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={
                isUploading ||
                !form.watch("title")?.trim() ||
                !form.watch("date") ||
                !form.watch("story")?.trim() ||
                files.length === 0
              }
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading...
                </>
              ) : (
                "Upload Media Item"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
