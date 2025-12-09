// app/admin/team/add/page.tsx   (new page)
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(2),
  title: z.string().min(5),
  image: z.instanceof(FileList).refine((files) => files.length === 1, "Image is required"),
});

export default function AddTeamMember() {
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", title: "" },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setUploading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("title", data.title);
    formData.append("image", data.image[0]);

    const res = await fetch("/api/admin/team/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      form.reset();
      alert("Team member added!");
    } else {
      alert("Upload failed");
    }
    setUploading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Add Team Member</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Hon. Alice Wahome, E.G.H." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Title / Designation</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cabinet Secretary, Ministry of Lands, Public Works, Housing and Urban Development"
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Photo (Portrait)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? "Uploading..." : "Add Team Member"}
          </Button>
        </form>
      </Form>
    </div>
  );
}