"use client";

import { useEffect } from "react";
import { getNYCTime } from "@/lib/timemode";

export default function TimeModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const update = () => {
      const { mode } = getNYCTime();
      document.documentElement.dataset.timemode = mode;
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
