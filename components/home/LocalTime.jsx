"use client";

import { useState, useEffect } from "react";

export default function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const getKathmanduTime = () => {
      try {
        return new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kathmandu",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
      } catch (_) {
        return "";
      }
    };

    setTime(getKathmanduTime());

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId;

    const timeoutId = setTimeout(() => {
      setTime(getKathmanduTime());
      intervalId = setInterval(() => {
        setTime(getKathmanduTime());
      }, 60000);
    }, Math.max(delay, 0));

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <span
      className="font-mono tabular-nums inline-block min-w-[5.5rem] text-right"
      title="Local Time in Asia/Kathmandu (UTC+05:45)"
    >
      {time ? `${time} NPT` : "--:-- NPT"}
    </span>
  );
}
