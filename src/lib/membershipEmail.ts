export interface MembershipConfirmationDetails {
  customerName: string;
  customerEmail: string;
  planName: string;
  accessCode: string;
  monthlyPrice: number;
  startDate: string;
}

/**
 * Sends membership confirmation email with access code to the new member
 */
export async function sendMembershipConfirmationEmail(details: MembershipConfirmationDetails): Promise<{ ok: boolean; status: number }> {
  const payload = {
    to: details.customerEmail,
    subject: `Welcome to Cornerstone Mobile Detailing - Your Access Code`,
    type: 'membership_confirmation',
    ...details,
  };

  const webhook = import.meta.env.VITE_MEMBERSHIP_WEBHOOK_URL as string | undefined;
  const targets = [
    webhook?.trim(),
    "/api/send-membership-confirmation",
  ].filter(Boolean) as string[];

  for (const url of targets) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { ok: true, status: res.status };
      if (res.status === 404) continue;
      return { ok: false, status: res.status };
    } catch {
      continue;
    }
  }

  return { ok: false, status: 0 };
}
