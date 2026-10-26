// Shared helpers for the download scripts.

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Runs `request`, retrying failures after backoffMs, 2×backoffMs, …; the final error names `label`. */
export async function withRetry(request, { label, attempts = 4, backoffMs = 2000 }) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await request();
    } catch (error) {
      if (attempt >= attempts) throw new Error(`${label}: ${error.message}`);
      await sleep(backoffMs * attempt);
    }
  }
}
