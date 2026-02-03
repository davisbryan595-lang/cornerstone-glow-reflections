export interface MembershipConfirmationDetails {
  customerName: string;
  customerEmail: string;
  planName: string;
  accessCode: string;
  monthlyPrice: number;
  startDate: string;
}

/**
 * Sends membership confirmation email with access code to the new member via Web3Forms
 */
export async function sendMembershipConfirmationEmail(details: MembershipConfirmationDetails): Promise<{ ok: boolean; status: number }> {
  const startDateFormatted = new Date(details.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Prepare email content for Web3Forms
  const emailMessage = `
Welcome to Cornerstone Mobile Detailing!

Hi ${details.customerName},

Congratulations on joining Cornerstone Mobile Detailing! Your membership is now active.

MEMBERSHIP DETAILS:
- Plan: ${details.planName}
- Monthly Price: $${details.monthlyPrice.toFixed(2)}
- Start Date: ${startDateFormatted}

YOUR EXCLUSIVE ACCESS CODE: ${details.accessCode}

Keep this code safe! You'll use it to access your member benefits and manage your account.

WHAT YOU GET:
✓ Priority scheduling for your preferred time slots
✓ Exclusive member-only discounts on add-on services
✓ Regular maintenance service per your plan
✓ 24/7 access to your member portal
✓ Premium products and expert detailing

NEXT STEPS:
1. Save your access code in a safe place
2. Log in to your member dashboard using your email and password
3. Book your first appointment using your membership benefits
4. Enjoy priority support from our team

Questions? Contact us at cornerstonemobile55@gmail.com or call 980-312-4236

Thank you for choosing Cornerstone Mobile Detailing!

---
© 2024 Cornerstone Mobile Detailing. All rights reserved.
You're receiving this email because you created an account on our website.
  `.trim();

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: '045ecce7-3791-4ad7-946c-86810d670291', // Same key as ContactForm
        name: 'Cornerstone Mobile Detailing',
        email: details.customerEmail,
        subject: '🎉 Welcome to Cornerstone Mobile Detailing - Your Access Code Inside',
        message: emailMessage,
        from_name: 'Cornerstone Mobile Detailing',
        replyto: 'cornerstonemobile55@gmail.com',
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { ok: true, status: response.status };
    } else {
      console.error(`Web3Forms API error:`, result.message);
      return { ok: false, status: response.status };
    }
  } catch (error) {
    console.error("Error sending membership confirmation email:", error);
    return { ok: false, status: 0 };
  }
}
