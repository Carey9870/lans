"use client";

import React from "react";
import { Toaster, toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { X, Info, AlertCircle, CheckCircleIcon, XCircle } from "lucide-react"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

type ToastType = "success" | "error" | "info" | "warning";

const toastTypeColors: Record<
  ToastType,
  { bg: string; progress: string; text: string }
> = {
  success: { bg: "bg-green-600", progress: "bg-yellow-300", text: "text-white" },
  error: { bg: "bg-red-300", progress: "bg-red-700", text: "text-white" },
  warning: { bg: "bg-amber-500", progress: "bg-blue-700", text: "text-white" },
  info: { bg: "bg-blue-400", progress: "bg-blue-700", text: "text-white" },
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon className="w-8 text-amber-300 h-8" strokeWidth={3} />;
    case "error":
      return <XCircle className="w-8 h-8 text-red-600" strokeWidth={3} />;
    case "warning":
      return <AlertCircle className="w-8 h-8 text-purple-500" strokeWidth={3}/>;
    case "info":
    default:
      return <Info className="w-10 h-10 text-pink-500" strokeWidth={3} />;
  }
};

export const showCustomToast = (
  message: string,
  type: ToastType = "info",
  duration = 4000
) => {
  const { bg, progress, text } = toastTypeColors[type];

  toast(
    () => {
      const [width, setWidth] = React.useState(100);

      React.useEffect(() => {
        const timer = setTimeout(() => setWidth(0), 50);
        return () => clearTimeout(timer);
      }, []);

      return (
        <div
          className={`relative w-80 ${bg} ${text} font-medium shadow-2xl flex items-center justify-between px-5 py-4 space-y-2 h-16 rounded-sm`}
        >
          {/* Left side: Icon + Message */}
          <div className="flex items-center mt-1 gap-3">
            <ToastIcon type={type} />
            <span className="text-sm font-medium">{message}</span>
          </div>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss()}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5 text-red-500" />
            {/* comment */}
          </button>

          {/* Full-width progress bar at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1">
            <div
              className={`${progress} h-full transition-all ease-linear origin-left`}
              style={{
                width: `${width}%`,
                transitionDuration: `${duration}ms`,
              }}
            />
          </div>
        </div>
      );
    },
    {
      duration,
      // Critical: kill all Sonner default wrapper styles
      style: {
        padding: 0,
        background: "transparent",
        border: "none",
        boxShadow: "none",
      },
      className: "!p-0 !m-0 !bg-transparent !border-none !shadow-none",
    }
  );
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <main>{children}</main>
      <Toaster richColors={false} position="top-right" closeButton={false} />
    </QueryClientProvider>
  );
}
