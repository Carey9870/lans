"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Home, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subjectArea: z.enum(["Enquiries", "Feedback", "Complement", "Others"], {
    required_error: "Please select a subject area",
  }),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedSubjectArea = watch("subjectArea");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", data);
    alert("Thank you! Your message has been sent.");
    reset();
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-black font-serif mb-12">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Contact Info */}
            <Card className="p-8 bg-green-50 border-purple-600 shadow-lg">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-black mb-4">
                    State Department for Lands and Physical Planning
                  </h2>
                  <p className="text-black">
                    Ardhi House 1st Ngong Avenue, off Ngong Rd,
                    <br />
                    P.O. Box 30450 - 00100, Nairobi, Kenya
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Physical Address
                      </h3>
                      <p className="text-gray-600">
                        Ardhi House, 1st Ngong Avenue, off Ngong Rd, Nairobi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-fuchsia-200 p-3 rounded-full">
                      <Home className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Postal Address
                      </h3>
                      <p className="text-gray-600">
                        P.O. Box 30450 - 00100, Nairobi, Kenya
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-200 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Telephone</h3>
                      <p className="text-gray-600 text-sm">
                        +254 202718050 / 204803886 / 020 271 80 50 /
                        <br />
                        020 480 40 00 / 020 480 30 00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-red-200 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">E-mail</h3>
                      <p className="text-gray-600">info@ardhi.go.ke</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Column - Contact Form */}
            <Card className="p-8 shadow-lg bg-fuchsia-50 border-red-500">
              <h2 className="text-2xl font-bold text-black mb-3 underline">
                Enquiries / Feedback
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center">
                      <Label className="font-bold" htmlFor="name">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        {...register("name")}
                        className={cn(errors.name && "border-red-500")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <Label className="font-bold" htmlFor="email">
                        Your Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your Email"
                        {...register("email")}
                        className={cn(errors.email && "border-red-500")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <Label className="font-bold" htmlFor="subjectArea">Subject Area</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("subjectArea", value as any)
                    }
                    value={selectedSubjectArea}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        !selectedSubjectArea && "text-black border-black",
                        errors.subjectArea && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="-- Select --" />
                      <ChevronDown className="h-5 w-5 animate-bounce" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enquiries">Enquiries</SelectItem>
                      <SelectItem value="Feedback">Feedback</SelectItem>
                      <SelectItem value="Complement">Complement</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subjectArea && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subjectArea.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-x-5">
                  <Label className="font-bold" htmlFor="subject">Subject:</Label>
                  <Input
                    id="subject"
                    placeholder="Subject"
                    {...register("subject")}
                    className={cn(errors.subject && "border-red-500")}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="font-bold" htmlFor="message">Message:</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter Message in the TextArea"
                    rows={6}
                    {...register("message")}
                    className={cn(errors.message && "border-red-500", cn("resize-none bg-white"))}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer bg-amber-700 hover:bg-amber-800 text-white font-semibold py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Message..." : "Send message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
