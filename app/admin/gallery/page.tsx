// app/admin/gallery/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import UploadForm from "./upload/client-form";

export const metadata = {
   title: "Upload Gallery Media",
};

export default function UploadGalleryPage() {
  return (
    <div className="container max-w-7xl mx-auto py-3 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/management-and-leadership">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hover:underline text-red-500"> Back to Gallery </span>
        </Link>
      </Button>

      <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Media</h1>
      <p className="text-sm mb-4">
        Add images and videos to your leadership gallery.
      </p>

      <Card className="border border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Upload className="h-6 w-6" />
            Drop files here or click to browse
          </CardTitle>
          <CardDescription>
            Drag and drop or click to select, JPG, PNG, WebP, MP4, MOV • Max 12 files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
}