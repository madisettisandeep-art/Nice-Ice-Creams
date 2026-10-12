"use client";

import { useState, useEffect } from "react";

/**
 * Debounces rapidly changing values (e.g., search inputs, filter sliders)
 * to prevent unnecessary re-renders and main-thread layout thrashing.
 */
export function useDebounce<T>(value: T, delayMs: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

interface ClientCacheEntry<T> {
  data: T;
  etag?: string;
  expiresAt: number;
}

const clientApiCache = new Map<string, ClientCacheEntry<unknown>>();

/**
 * Client-side API response cache with ETag conditional revalidation (`If-None-Match`)
 * and TTL deduplication.
 */
export async function fetchWithClientCache<T>(
  url: string,
  ttlMs: number = 60_000
): Promise<T> {
  const now = Date.now();
  const cached = clientApiCache.get(url) as ClientCacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const headers: Record<string, string> = {};
  if (cached?.etag) {
    headers["If-None-Match"] = cached.etag;
  }

  const res = await fetch(url, { headers });

  if (res.status === 304 && cached) {
    cached.expiresAt = now + ttlMs;
    return cached.data;
  }

  if (!res.ok) {
    if (cached) return cached.data;
    throw new Error(`API error: ${res.status}`);
  }

  const data = (await res.json()) as T;
  const etag = res.headers.get("ETag") || undefined;

  clientApiCache.set(url, {
    data,
    etag,
    expiresAt: now + ttlMs,
  });

  return data;
}

