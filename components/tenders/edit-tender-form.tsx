// components/edit-tender-form.tsx
"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, startOfDay, isBefore } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, 
  PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, 
  SelectContent, 
  SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dropzone } from "@/components/tenders/dropzone";

import { cn } from "@/lib/utils";

type Tender = {
  id: number;
  tender_no: string;
  description: string;
  start_date: string; // "2025-05-12"
  closing_datetime: string; // ISO string
  document_name?: string;
  document_path?: string;
};

export default function EditTenderForm({ tenderId }: { tenderId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [closingDate, setClosingDate] = useState<Date | undefined>();
  const [closingTime, setClosingTime] = useState("17:00");
  const [file, setFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = startOfDay(new Date());

  // Fetch tender
  const { data: tender, isLoading } = useQuery<Tender>({
    queryKey: ["tender", tenderId],
    queryFn: async () => {
      const res = await fetch(`/api/tenders/${tenderId}`);
      if (!res.ok) throw new Error("Failed to fetch tender");
      return res.json();
    },
  });

  // Pre-fill form when data loads
  useEffect(() => {
    if (tender) {
      setStartDate(new Date(tender.start_date));
      const closing = new Date(tender.closing_datetime);
      setClosingDate(closing);
      setClosingTime(format(closing, "HH:mm"));
      setExistingFile(tender.document_name || null);
    }
  }, [tender]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/tenders/${tenderId}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update tender");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Success -Tender updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
      queryClient.invalidateQueries({ queryKey: ["tender", tenderId] });
      router.push("/admin/tenders");
    },
    onError: (err) => {
      console.error(err)
      toast.error("Error");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!startDate || !closingDate) {
      toast.error("Error - Please select both dates");
      return;
    }

    if (isBefore(startDate, today)) {
      toast.error("Error - Start date cannot be in the past");
      return;
    }

    const [hours, minutes] = closingTime.split(":").map(Number);
    const closingDateTime = new Date(closingDate);
    closingDateTime.setHours(hours, minutes, 0, 0);

    if (!isBefore(startDate, closingDateTime)) {
      toast.error("Error - Closing date must be after start date");
      return;
    }

    const formData = new FormData();
    formData.append("tender_no", (e.target as any).tender_no.value);
    formData.append("description", (e.target as any).description.value);
    formData.append("start_date", startDate.toISOString().split("T")[0]);
    formData.append("closing_datetime", closingDateTime.toISOString());

    if (file) {
      formData.append("document", file);
    }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tender) {
    return <div className="text-center text-destructive">Tender not found</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tender_no">Tender No</Label>
          <Input
            id="tender_no"
            name="tender_no"
            defaultValue={tender.tender_no}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={tender.description}
          rows={5}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Closing Date</Label>
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
          <Label>Closing Time</Label>
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

      <div className="space-y-4">
        <Label>Document</Label>
        {existingFile && !file ? (
          <div className="p-4 border rounded-lg bg-muted/50 flex items-center justify-between">
            <span className="text-sm font-medium">{existingFile}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
              Change File
            </Button>
          </div>
        ) : (
          <Dropzone
            file={file}
            onFileAccepted={setFile}
            onFileRemoved={() => setFile(null)}
          />
        )}
      </div>

      {progress > 0 && progress < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Updating...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

