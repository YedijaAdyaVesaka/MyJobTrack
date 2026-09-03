"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function DasborGreeting() {
  const [name, setName] = useState<string>("");
  const [clock, setClock] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Use user_metadata.name, or email prefix, or fallback
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Pengguna";
        setName(displayName);
      }
    });
  }, []);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {greeting}
        {name ? `, ${name}` : ""} 👋
      </h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
        <p className="text-sm text-muted-foreground">{dateStr}</p>
        {clock && (
          <span className="text-sm font-medium tabular-nums text-primary">
            🕐 {clock}
          </span>
        )}
      </div>
    </div>
  );
}
