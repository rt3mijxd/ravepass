"use client";

import { useEffect, useState } from "react";
import type { PriceQuotes } from "@/lib/prices";

export function usePriceQuotes() {
  const [quotes, setQuotes] = useState<PriceQuotes | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rates", { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<PriceQuotes> : null)
      .then((value) => { if (!controller.signal.aborted) setQuotes(value); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return quotes;
}
