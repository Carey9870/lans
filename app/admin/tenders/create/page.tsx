// app/admin/tenders/create/page.tsx
"use client";

import { toast  } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, startOfDay, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dropzone } from "@/components/tenders/dropzone"; 

import { cn } from "@/lib/utils";

export default function CreateTenderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [closingDate, setClosingDate] = useState<Date | undefined>();
  const [closingTime, setClosingTime] = useState("17:00");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = startOfDay(new Date());

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/tenders", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create tender");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Success - Tender created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
      router.push("/admin/tenders");
    },
    onError: (err: any) => {
      toast.error("Error");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!startDate || !closingDate || !file) {
      toast.error("Error");
      return;
    }

    if (isBefore(startDate, today)) {
      toast.error("Error");
      return;
    }

    const [hours, minutes] = closingTime.split(":").map(Number);
    const closingDateTime = new Date(closingDate);
    closingDateTime.setHours(hours, minutes, 0, 0);

    if (!isBefore(startDate, closingDateTime)) {
      toast.error("Error");
      return;
    }

    const formData = new FormData();
    formData.append("tender_no", (e.target as any).tender_no.value);
    formData.append("description", (e.target as any).description.value);
    formData.append("start_date", startDate.toISOString().split("T")[0]);
    formData.append("closing_datetime", closingDateTime.toISOString());
    formData.append("document", file);

    setIsSubmitting(true);
    setProgress(10);

    const interval = setInterval(() => setProgress(p => Math.min(p + 15, 90)), 200);

    try {
      await mutation.mutateAsync(formData);
      clearInterval(interval);
      setProgress(100);
    } catch {
      clearInterval(interval);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Create New Tender</h1>
      <p className="text-muted-foreground mb-8">Fill in all details to publish a tender</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tender_no">Tender No *</Label>
            <Input id="tender_no" name="tender_no" placeholder="TENDER/2025/001" required />
          </div>

          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !startDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => isBefore(date, today)}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" name="description" rows={5} required />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Closing Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !closingDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {closingDate ? format(closingDate, "PPP") : "Pick closing date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={closingDate}
                  onSelect={setClosingDate}
                  disabled={(date) => !startDate || isBefore(date, startDate)}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Closing Time *</Label>
            <Select value={closingTime} onValueChange={setClosingTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 48 }, (_, i) => {
                  const h = Math.floor(i / 2);
                  const m = i % 2 === 0 ? "00" : "30";
                  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
                  const period = h < 12 ? "AM" : "PM";
                  return (
                    <SelectItem key={i} value={`${h.toString().padStart(2, "0")}:${m}`}>
                      {displayH}:{m} {period}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Invitation to Tender Document *</Label>
          <Dropzone
            file={file}
            onFileAccepted={setFile}
            onFileRemoved={() => setFile(null)}
          />
        </div>

        {progress > 0 && progress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading document...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <Button type="submit" size="lg" disabled={isSubmitting || !file}>
            {isSubmitting ? "Creating..." : "Create Tender"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}