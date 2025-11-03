export interface SubscriptionEmailDetails {
  serviceType?: string;
  tier?: string;
  frequency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleInfo?: string;
  additionalNotes?: string;
  submittedAt?: string;
}

/**
 * Sends subscription details to a configured webhook (Zapier/Make/etc) or
 * falls back to a relative API path if no webhook is configured.
 * Do not include secrets in code; configure VITE_SUBSCRIPTION_WEBHOOK_URL in env.
 */
export async function sendSubscriptionEmail(details: SubscriptionEmailDetails): Promise<{ ok: boolean; status: number }>{
  const payload = { ...details, submittedAt: details.submittedAt ?? new Date().toISOString() };

  const webhook = import.meta.env.VITE_SUBSCRIPTION_WEBHOOK_URL as string | undefined;
  const targets = [
    webhook?.trim(),
    "/api/send-subscription-email",
  ].filter(Boolean) as string[];

  for (const url of targets) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { ok: true, status: res.status };
      // Some hosts may return 404 for missing handler; try next target
      if (res.status === 404) continue;
      return { ok: false, status: res.status };
    } catch {
      // Network error; try next target
      continue;
    }
  }

  return { ok: false, status: 0 };
}
