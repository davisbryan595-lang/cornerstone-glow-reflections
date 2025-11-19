import { getSupabase } from "./supabase";

export const isUsingSupabase = true;

function getSupabaseClient() {
  return getSupabase();
}

export const db = {
  profiles: {
    async get(userId: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async upsert(profile: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("profiles").upsert(profile).select();
      if (error) throw error;
      return data;
    },
    async list() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data || [];
    },
  },

  memberships: {
    async get(userId: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("memberships").select("*").eq("user_id", userId).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async getActive(userId: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async upsert(membership: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("memberships").upsert(membership).select();
      if (error) throw error;
      return data;
    },
    async list() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("memberships").select("*");
      if (error) throw error;
      return data || [];
    },
    async listActive() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("memberships").select("*").eq("status", "active");
      if (error) throw error;
      return data || [];
    },
    async update(userId: string, updates: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("memberships").update(updates).eq("user_id", userId).select();
      if (error) throw error;
      return data?.[0] || null;
    },
    async search(query: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("memberships").select("*, profiles(email)").ilike("profiles.email", `%${query}%`);
      if (error) throw error;
      return data || [];
    },
  },

  accessCodes: {
    async create(accessCode: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("access_codes").insert(accessCode).select();
      if (error) throw error;
      return data?.[0];
    },
    async get(code: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("access_codes").select("*").eq("code", code).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async getByMembership(membershipId: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("access_codes").select("*").eq("membership_id", membershipId).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async listByUser(userId: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("access_codes").select("*").eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    async listAll() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("access_codes").select("*");
      if (error) throw error;
      return data || [];
    },
    async markAsUsed(id: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("access_codes").update({ is_used: true, used_at: new Date().toISOString() }).eq("id", id).select();
      if (error) throw error;
      return data?.[0] || null;
    },
  },

  discountCodes: {
    async create(discountCode: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("discount_codes").insert(discountCode).select();
      if (error) throw error;
      return data?.[0];
    },
    async get(code: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("discount_codes").select("*").eq("code", code).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async listAll() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("discount_codes").select("*");
      if (error) throw error;
      return data || [];
    },
    async listActive() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("discount_codes").select("*").gte("expires_at", new Date().toISOString()).eq("is_active", true);
      if (error) throw error;
      return data || [];
    },
    async update(code: string, updates: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("discount_codes").update(updates).eq("code", code).select();
      if (error) throw error;
      return data?.[0] || null;
    },
    async incrementUses(code: string) {
      const existing = await db.discountCodes.get(code);
      if (!existing) return null;
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("discount_codes")
        .update({ current_uses: (existing.current_uses || 0) + 1 })
        .eq("code", code)
        .select();
      if (error) throw error;
      return data?.[0] || null;
    },
  },

  invoices: {
    async create(invoice: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("invoices").insert(invoice).select();
      if (error) throw error;
      return data?.[0];
    },
    async get(id: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("invoices").select("*").eq("id", id).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async listByUser(userId: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("invoices").select("*").eq("user_id", userId).order("issued_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async listByMembership(membershipId: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("invoices").select("*").eq("membership_id", membershipId).order("issued_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async listAll() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("invoices").select("*").order("issued_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async update(id: string, updates: any) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("invoices").update(updates).eq("id", id).select();
      if (error) throw error;
      return data?.[0] || null;
    },
  },

  passwordResetTokens: {
    async create(userId: string, token: string, expiresAt: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("password_reset_tokens").insert({ user_id: userId, token, expires_at: expiresAt }).select();
      if (error) throw error;
      return data?.[0];
    },
    async getByToken(token: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("password_reset_tokens").select("*").eq("token", token).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    async markAsUsed(id: string) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("password_reset_tokens").update({ used_at: new Date().toISOString() }).eq("id", id).select();
      if (error) throw error;
      return data?.[0] || null;
    },
  },
};

export async function validateAndGetDiscount(discountCode: string, planId: string) {
  const code = (discountCode || "").toUpperCase();
  const discount: any = await db.discountCodes.get(code);
  if (!discount) return { valid: false, discount: null, error: "Discount code not found" };
  if (!discount.is_active) return { valid: false, discount: null, error: "Discount code is inactive" };
  if (discount.expires_at && new Date(discount.expires_at) < new Date()) return { valid: false, discount: null, error: "Discount code has expired" };
  if ((discount.current_uses || 0) >= (discount.max_uses || 0)) return { valid: false, discount: null, error: "Discount code limit reached" };
  if (discount.plan_id !== planId && discount.plan_id !== "all") return { valid: false, discount: null, error: "Discount code not valid for this plan" };
  return { valid: true, discount };
}

export default db;
