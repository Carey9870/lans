// components/countdown-timer.tsx
"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="text-red-600 font-bold text-sm">
      {minutes}:{secs.toString().padStart(2, "0")} remaining
    </span>
  );
}

