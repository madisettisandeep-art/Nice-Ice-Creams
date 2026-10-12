const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit = 15,
  windowMs = 60_000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: 0,
  };
}

