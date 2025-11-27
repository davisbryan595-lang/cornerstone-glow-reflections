export interface MembershipConfirmationDetails {
  customerName: string;
  customerEmail: string;
  planName: string;
  accessCode: string;
  monthlyPrice: number;
  startDate: string;
}

/**
 * Sends membership confirmation email with access code to the new member via Resend API
 */
export async function sendMembershipConfirmationEmail(details: MembershipConfirmationDetails): Promise<{ ok: boolean; status: number }> {
  const payload = {
    customerName: details.customerName,
    customerEmail: details.customerEmail,
    planName: details.planName,
    accessCode: details.accessCode,
    monthlyPrice: details.monthlyPrice,
    startDate: details.startDate,
  };

  // Try the local API endpoint first (uses Resend)
  const apiUrl = "/api/send-membership-confirmation";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { ok: true, status: res.status };
    } else {
      console.error(`Email API returned status ${res.status}`);
      return { ok: false, status: res.status };
    }
  } catch (error) {
    console.error("Error sending membership confirmation email:", error);
    return { ok: false, status: 0 };
  }
}
