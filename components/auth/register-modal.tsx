// components/auth/register-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    phone: z
      .string()
      .refine(
        (val) => val.startsWith("07") && val.length === 10 && /^\d+$/.test(val),
        {
          message: "Phone must start with 07 and be 10 digits",
        }
      ),
    altPhone: z.string().optional(),
    email: z
      .string()
      .email()
      .refine((val) => val.endsWith("@gmail.com"), {
        message: "Email must be a gmail.com address",
      }),
    password: z
      .string()
      .trim()
      .refine((val) => val.length >= 12, {
        message: "Password must be at least 12 characters long",
      })
      .refine((val) => (val.match(/[A-Z]/g) || []).length >= 2, {
        message: "Password must contain at least 2 uppercase letters",
      })
      .refine((val) => (val.match(/ /g) || []).length >= 2, {
        message: "Password must contain at least 2 internal spaces",
      })
      .refine((val) => (val.match(/[^A-Za-z0-9\s]/g) || []).length >= 2, {
        message: "Password must contain at least 2 symbols (e.g. !@#$%^&*)",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

// Add props — this is the only change!
type RegisterModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRegisterSuccess: () => void;
};

export function RegisterModal({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onRegisterSuccess,
}: RegisterModalProps) {
  // Keep your internal state — it will be used when not controlled
  const [internalOpen, setInternalOpen] = useState(false);

  // This is the magic: use external control if provided, otherwise fall back to internal
  const open = externalOpen ?? internalOpen;
  const onOpenChange = externalOnOpenChange ?? setInternalOpen;

  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const [otpValue, setOtpValue] = useState("");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      altPhone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const res = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Registration failed");
      return res.json();
    },
    onSuccess: () => {
      setEmail(form.getValues("email"));
      setStep("otp");
      setTimeLeft(90);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (otp: string) => {
      const res = await fetch("/api/admin/auth/verify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Invalid OTP");
      return res.json();
    },
    onSuccess: () => {
      onOpenChange(false); // Close modal (works for both internal & external)
      onRegisterSuccess(); // Notify parent
    },
  });

  const resendMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/auth/resend-otp-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to resend");
        return res.json();
      }),

    onSuccess: () => setTimeLeft(90),
  });

  useEffect(() => {
    if (step !== "otp" || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleOtpComplete = (value: string) => {
    setOtpValue(value);
    if (value.length === 7) verifyMutation.mutate(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Register as Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? "Admin Registration" : "Verify OTP"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => registerMutation.mutate(d))}
              className="space-y-4"
            >
              {/* All your FormFields — unchanged */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="07xxxxxxxx" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="altPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Phone (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="example@gmail.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full"
              >
                {registerMutation.isPending && <Spinner className="mr-2" />}
                Register
              </Button>
              {registerMutation.error && (
                <p className="text-sm text-red-500">
                  {(registerMutation.error as Error).message}
                </p>
              )}
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-center">
              OTP sent to your email & phone · Expires in:{" "}
              <strong>{formatTime(timeLeft)}</strong>
            </p>

            <InputOTP
              maxLength={7}
              value={otpValue}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              onChange={handleOtpComplete}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              variant="link"
              disabled={timeLeft > 0 || resendMutation.isPending}
              onClick={() => resendMutation.mutate()}
              className="w-full"
            >
              {resendMutation.isPending ? <Spinner className="mr-2" /> : null}
              Resend OTP {timeLeft > 0 && `(${formatTime(timeLeft)})`}
            </Button>

            {verifyMutation.error && (
              <p className="text-sm text-red-500 text-center">
                {(verifyMutation.error as Error).message}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
