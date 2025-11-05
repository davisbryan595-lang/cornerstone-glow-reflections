// Mock Database Layer
// This simulates a database for development. Replace with real Supabase calls later.

import { Profile, Membership } from "@/context/AuthProvider";

export interface AccessCode {
  id: string;
  code: string;
  user_id: string;
  membership_id: string;
  plan_id: string;
  created_at: string;
  expires_at: string;
  used_at?: string;
  is_used: boolean;
}

export interface DiscountCode {
  id: string;
  code: string;
  plan_id: string;
  discount_percentage: number;
  description: string;
  max_uses: number;
  current_uses: number;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

// In-memory storage
const mockProfiles = new Map<string, Profile>();
const mockMemberships = new Map<string, Membership>();
const mockAccessCodes = new Map<string, AccessCode>();
const mockDiscountCodes = new Map<string, DiscountCode>();

// Initialize with some sample data
function initializeMockData() {
  // Sample admin user
  mockProfiles.set("admin-user-1", {
    id: "profile-1",
    user_id: "admin-user-1",
    email: "admin@example.com",
    role: "admin",
    marketing_opt_in: true,
    created_at: new Date().toISOString(),
  });

  // Sample regular user
  mockProfiles.set("user-1", {
    id: "profile-2",
    user_id: "user-1",
    email: "user@example.com",
    role: "user",
    marketing_opt_in: false,
    created_at: new Date().toISOString(),
  });

  // Sample member
  mockProfiles.set("member-1", {
    id: "profile-3",
    user_id: "member-1",
    email: "member@example.com",
    role: "user",
    marketing_opt_in: true,
    created_at: new Date().toISOString(),
  });

  // Sample membership
  mockMemberships.set("member-1", {
    id: "membership-1",
    user_id: "member-1",
    plan_id: "maintenance-premium",
    status: "active",
    payment_status: "paid",
    access_code: "MEM-ABC123XY",
    next_billing_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    start_date: new Date().toISOString(),
    end_date: null,
  });

  // Sample discount codes
  mockDiscountCodes.set("WELCOME10", {
    id: "discount-1",
    code: "WELCOME10",
    plan_id: "maintenance-basic",
    discount_percentage: 10,
    description: "Welcome discount for new members",
    max_uses: 100,
    current_uses: 15,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  });

  mockDiscountCodes.set("PREMIUM20", {
    id: "discount-2",
    code: "PREMIUM20",
    plan_id: "maintenance-premium",
    discount_percentage: 20,
    description: "Premium plan discount",
    max_uses: 50,
    current_uses: 8,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  });

  mockDiscountCodes.set("ELITE25", {
    id: "discount-3",
    code: "ELITE25",
    plan_id: "maintenance-elite",
    discount_percentage: 25,
    description: "Elite plan exclusive discount",
    max_uses: 25,
    current_uses: 3,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  });
}

initializeMockData();

// Profile Operations
export const mockDb = {
  profiles: {
    async get(userId: string): Promise<Profile | null> {
      return mockProfiles.get(userId) || null;
    },
    async upsert(profile: Profile): Promise<void> {
      mockProfiles.set(profile.user_id, profile);
    },
    async list(): Promise<Profile[]> {
      return Array.from(mockProfiles.values());
    },
  },

  memberships: {
    async get(userId: string): Promise<Membership | null> {
      return mockMemberships.get(userId) || null;
    },
    async getActive(userId: string): Promise<Membership | null> {
      const membership = mockMemberships.get(userId);
      return membership?.status === "active" ? membership : null;
    },
    async upsert(membership: Membership): Promise<void> {
      mockMemberships.set(membership.user_id, membership);
    },
    async list(): Promise<Membership[]> {
      return Array.from(mockMemberships.values());
    },
    async listActive(): Promise<Membership[]> {
      return Array.from(mockMemberships.values()).filter((m) => m.status === "active");
    },
  },

  accessCodes: {
    async create(accessCode: Omit<AccessCode, "id" | "created_at">): Promise<AccessCode> {
      const id = `access-${Date.now()}`;
      const code: AccessCode = {
        id,
        created_at: new Date().toISOString(),
        ...accessCode,
      };
      mockAccessCodes.set(id, code);
      return code;
    },
    async get(code: string): Promise<AccessCode | null> {
      for (const accessCode of mockAccessCodes.values()) {
        if (accessCode.code === code) return accessCode;
      }
      return null;
    },
    async getByMembership(membershipId: string): Promise<AccessCode | null> {
      for (const code of mockAccessCodes.values()) {
        if (code.membership_id === membershipId) return code;
      }
      return null;
    },
    async listByUser(userId: string): Promise<AccessCode[]> {
      return Array.from(mockAccessCodes.values()).filter((c) => c.user_id === userId);
    },
    async listAll(): Promise<AccessCode[]> {
      return Array.from(mockAccessCodes.values());
    },
    async markAsUsed(id: string): Promise<void> {
      const code = mockAccessCodes.get(id);
      if (code) {
        code.is_used = true;
        code.used_at = new Date().toISOString();
        mockAccessCodes.set(id, code);
      }
    },
  },

  discountCodes: {
    async create(discountCode: Omit<DiscountCode, "id" | "created_at">): Promise<DiscountCode> {
      const id = `discount-${Date.now()}`;
      const code: DiscountCode = {
        id,
        created_at: new Date().toISOString(),
        ...discountCode,
      };
      mockDiscountCodes.set(code.code, code);
      return code;
    },
    async get(code: string): Promise<DiscountCode | null> {
      return mockDiscountCodes.get(code) || null;
    },
    async listAll(): Promise<DiscountCode[]> {
      return Array.from(mockDiscountCodes.values());
    },
    async listActive(): Promise<DiscountCode[]> {
      return Array.from(mockDiscountCodes.values()).filter((c) => c.is_active && new Date(c.expires_at) > new Date());
    },
    async update(code: string, updates: Partial<DiscountCode>): Promise<DiscountCode | null> {
      const existing = mockDiscountCodes.get(code);
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      mockDiscountCodes.set(code, updated);
      return updated;
    },
    async incrementUses(code: string): Promise<void> {
      const existing = mockDiscountCodes.get(code);
      if (existing) {
        existing.current_uses += 1;
        mockDiscountCodes.set(code, existing);
      }
    },
  },
};

// Helper to validate and get discount
export async function validateAndGetDiscount(
  discountCode: string,
  planId: string
): Promise<{ valid: boolean; discount: DiscountCode | null; error?: string }> {
  const discount = await mockDb.discountCodes.get(discountCode.toUpperCase());

  if (!discount) {
    return { valid: false, discount: null, error: "Discount code not found" };
  }

  if (!discount.is_active) {
    return { valid: false, discount: null, error: "Discount code is inactive" };
  }

  if (new Date(discount.expires_at) < new Date()) {
    return { valid: false, discount: null, error: "Discount code has expired" };
  }

  if (discount.current_uses >= discount.max_uses) {
    return { valid: false, discount: null, error: "Discount code limit reached" };
  }

  if (discount.plan_id !== planId && discount.plan_id !== "all") {
    return { valid: false, discount: null, error: "Discount code not valid for this plan" };
  }

  return { valid: true, discount };
}
