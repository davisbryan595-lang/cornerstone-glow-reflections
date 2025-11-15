// Payment Integration Utility
// This utility handles payment processing for membership plans
// Currently configured for Stripe integration

export interface PaymentPlan {
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: "monthly" | "annual";
  description: string;
}

export interface PaymentRequest {
  planId: string;
  customerId: string;
  email: string;
  paymentFrequency: "monthly" | "full";
  agreedToTerms: boolean;
}

export interface PaymentResponse {
  success: boolean;
  sessionId?: string;
  error?: string;
}

// Membership plan pricing
export const MEMBERSHIP_PLANS: Record<string, PaymentPlan> = {
  "maintenance-basic": {
    planId: "maintenance-basic",
    planName: "Maintenance - Basic",
    amount: 5000, // $50.00 in cents
    currency: "usd",
    interval: "month",
    description: "Monthly maintenance detail service",
  },
  "maintenance-premium": {
    planId: "maintenance-premium",
    planName: "Maintenance - Premium",
    amount: 5000, // $50.00 in cents
    currency: "usd",
    interval: "month",
    description: "Bi-monthly full detail service",
  },
  "maintenance-elite": {
    planId: "maintenance-elite",
    planName: "Maintenance - Elite",
    amount: 5000, // $50.00 in cents
    currency: "usd",
    interval: "month",
    description: "Quarterly comprehensive detail service",
  },
};

// Calculate total price based on payment frequency
export const calculateTotalPrice = (
  monthlyPrice: number,
  frequency: "monthly" | "full"
): number => {
  if (frequency === "full") {
    // Pay for 3 months with 7% discount
    const fullPrice = monthlyPrice * 3;
    return Math.round(fullPrice * 0.93); // Apply 7% discount
  }
  return monthlyPrice;
};

// Process payment with Stripe
// This will be called when the user clicks "Proceed to Payment"
export const processPayment = async (
  request: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    // In a production environment, this would call your backend API
    // which would use the Stripe API to create a payment session
    // For now, we'll return a mock response

    // Check if Stripe is configured
    const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
    if (!stripePublicKey) {
      console.warn(
        "Stripe public key not configured. Payment processing is not available."
      );
      return {
        success: false,
        error: "Payment processing is not currently available. Please contact support.",
      };
    }

    // Call your backend API to create a Stripe checkout session
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const data = await response.json();
    return {
      success: true,
      sessionId: data.sessionId,
    };
  } catch (error) {
    console.error("Payment error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while processing payment",
    };
  }
};

// Verify payment (used after redirect from Stripe)
export const verifyPayment = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/verify-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    return response.ok;
  } catch (error) {
    console.error("Payment verification error:", error);
    return false;
  }
};

// Generate access code for members (generated after successful payment)
export const generateAccessCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
