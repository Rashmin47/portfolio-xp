"use client";

import { useState, useEffect } from "react";
import { nepalClock } from "@/lib/nepal-time";

export default function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    // Tick on the minute boundary so the clock never drifts
    const update = () => setTime(nepalClock());
    update();

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId;

    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60000);
    }, Math.max(delay, 0));

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <span
      className="font-mono tabular-nums inline-block min-w-[5.5rem] text-right"
      title="Local time in Asia/Kathmandu (UTC+05:45)"
    >
      {time ? `${time} NPT` : "--:-- NPT"}
    </span>
  );
}
