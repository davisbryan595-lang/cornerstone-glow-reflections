// Discount Code Manager
// Manages discount codes tied to subscription/membership plans

export interface DiscountTier {
  id: string;
  name: string;
  discountPercentage: number;
  description: string;
}

// Membership plan IDs
export const PLAN_IDS = {
  MAINTENANCE_BASIC: "maintenance-basic",
  MAINTENANCE_PREMIUM: "maintenance-premium",
  MAINTENANCE_ELITE: "maintenance-elite",
} as const;

// Predefined discount tiers
export const DISCOUNT_TIERS: Record<string, DiscountTier> = {
  basic: {
    id: "basic",
    name: "Basic",
    discountPercentage: 10,
    description: "10% discount on Basic plan",
  },
  premium: {
    id: "premium",
    name: "Premium",
    discountPercentage: 20,
    description: "20% discount on Premium plan",
  },
  elite: {
    id: "elite",
    name: "Elite",
    discountPercentage: 25,
    description: "25% discount on Elite plan",
  },
  referral: {
    id: "referral",
    name: "Referral",
    discountPercentage: 15,
    description: "15% referral discount",
  },
};

// Plan pricing in cents
export const PLAN_PRICING = {
  [PLAN_IDS.MAINTENANCE_BASIC]: 14999, // $149.99
  [PLAN_IDS.MAINTENANCE_PREMIUM]: 19999, // $199.99
  [PLAN_IDS.MAINTENANCE_ELITE]: 24999, // $249.99
} as const;

/**
 * Calculate discounted price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): number {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return Math.round(originalPrice - discountAmount);
}

/**
 * Calculate total savings from discount
 */
export function calculateSavings(
  originalPrice: number,
  discountPercentage: number
): number {
  return Math.round((originalPrice * discountPercentage) / 100);
}

/**
 * Format price in cents to readable currency
 */
export function formatPrice(priceInCents: number, currency: string = "USD"): string {
  const dollars = priceInCents / 100;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Generate a discount code for a specific tier
 */
export function generateDiscountCode(tier: string, customSuffix?: string): string {
  const tierUpper = tier.toUpperCase();
  const suffix = customSuffix || Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${tierUpper}${suffix}${timestamp}`.substring(0, 12);
}

/**
 * Parse discount code to extract tier info
 */
export function parseDiscountCode(code: string): { tier: string; isValid: boolean } {
  const upperCode = code.toUpperCase();

  for (const tier of Object.keys(DISCOUNT_TIERS)) {
    if (upperCode.startsWith(tier.toUpperCase())) {
      return { tier, isValid: true };
    }
  }

  return { tier: "", isValid: false };
}

/**
 * Validate discount code eligibility for plan
 */
export function isDiscountValidForPlan(
  discountCode: string,
  planId: string
): boolean {
  const codeUpper = discountCode.toUpperCase();

  // Extract tier from code
  for (const tierId of Object.keys(DISCOUNT_TIERS)) {
    if (codeUpper.startsWith(tierId.toUpperCase())) {
      // Match tier to plan
      if (tierId === "basic" && planId === PLAN_IDS.MAINTENANCE_BASIC) return true;
      if (tierId === "premium" && planId === PLAN_IDS.MAINTENANCE_PREMIUM) return true;
      if (tierId === "elite" && planId === PLAN_IDS.MAINTENANCE_ELITE) return true;
      if (tierId === "referral") return true; // Referral codes work for all plans
    }
  }

  return false;
}

/**
 * Get discount percentage for a code
 */
export function getDiscountPercentage(discountCode: string): number | null {
  const codeUpper = discountCode.toUpperCase();

  for (const [tierId, tier] of Object.entries(DISCOUNT_TIERS)) {
    if (codeUpper.startsWith(tierId.toUpperCase())) {
      return tier.discountPercentage;
    }
  }

  return null;
}

/**
 * Validate discount code format
 */
export function isValidDiscountCodeFormat(code: string): boolean {
  // Format: TIER+SUFFIX+TIMESTAMP (e.g., PREMIUM20ABC)
  // Should be 8-12 characters alphanumeric
  return /^[A-Z0-9]{8,12}$/.test(code.toUpperCase());
}

/**
 * Calculate checkout summary with discount
 */
export function calculateCheckoutSummary(
  planId: string,
  discountCode?: string
) {
  const originalPrice = PLAN_PRICING[planId as keyof typeof PLAN_PRICING];
  if (!originalPrice) {
    return null;
  }

  let discountPercentage = 0;
  let discountAmount = 0;

  if (discountCode) {
    const percentage = getDiscountPercentage(discountCode);
    if (percentage && isDiscountValidForPlan(discountCode, planId)) {
      discountPercentage = percentage;
      discountAmount = calculateSavings(originalPrice, discountPercentage);
    }
  }

  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountPercentage,
    discountAmount,
    finalPrice,
    discountCode: discountPercentage > 0 ? discountCode : undefined,
  };
}

/**
 * Generate coupon code for member bulk distribution
 */
export function generateCouponBatch(
  tier: string,
  count: number,
  prefix?: string
): string[] {
  const coupons: string[] = [];
  const usedCodes = new Set<string>();

  for (let i = 0; i < count; i++) {
    let code = "";
    do {
      const tierUpper = tier.toUpperCase();
      const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `${prefix || tierUpper}${suffix}${random}`.substring(0, 12);
    } while (usedCodes.has(code));

    usedCodes.add(code);
    coupons.push(code);
  }

  return coupons;
}
