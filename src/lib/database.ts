import { getSupabase } from "./supabase";
import { mockDb } from "./mockDatabase";
import mysqlDb, { isMySQLEnabled as isUsingMySQL } from "./mysqlClient";

const supabase = (() => {
  try {
    return getSupabase();
  } catch {
    return null as any;
  }
})();

export { isUsingMySQL };
export const isUsingSupabase = !isUsingMySQL && Boolean(supabase);

export const db = {
  profiles: {
    async get(userId: string) {
      if (isUsingMySQL) return mysqlDb.profiles.get(userId);
      if (!supabase) return mockDb.profiles.get(userId);
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).limit(1).single();
      if (error) throw error;
      return data || null;
    },
    async upsert(profile: any) {
      if (isUsingMySQL) return mysqlDb.profiles.upsert(profile);
      if (!supabase) return mockDb.profiles.upsert(profile);
      const { data, error } = await supabase.from("profiles").upsert(profile).select();
      if (error) throw error;
      return data;
    },
    async list() {
      if (isUsingMySQL) return mysqlDb.profiles.list();
      if (!supabase) return mockDb.profiles.list();
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data || [];
    },
  },

  memberships: {
    async get(userId: string) {
      if (isUsingMySQL) return mysqlDb.memberships.get(userId);
      if (!supabase) return mockDb.memberships.get(userId);
      const { data, error } = await supabase.from("memberships").select("*").eq("user_id", userId).limit(1).single();
      if (error) throw error;
      return data || null;
    },
    async getActive(userId: string) {
      if (isUsingMySQL) return mysqlDb.memberships.getActive(userId);
      if (!supabase) return mockDb.memberships.getActive(userId);
      const { data, error } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .single();
      if (error) throw error;
      return data || null;
    },
    async upsert(membership: any) {
      if (isUsingMySQL) return mysqlDb.memberships.upsert(membership);
      if (!supabase) return mockDb.memberships.upsert(membership);
      const { data, error } = await supabase.from("memberships").upsert(membership).select();
      if (error) throw error;
      return data;
    },
    async list() {
      if (isUsingMySQL) return mysqlDb.memberships.list();
      if (!supabase) return mockDb.memberships.list();
      const { data, error } = await supabase.from("memberships").select("*");
      if (error) throw error;
      return data || [];
    },
    async listActive() {
      if (isUsingMySQL) return mysqlDb.memberships.listActive();
      if (!supabase) return mockDb.memberships.listActive();
      const { data, error } = await supabase.from("memberships").select("*").eq("status", "active");
      if (error) throw error;
      return data || [];
    },
  },

  accessCodes: {
    async create(accessCode: any) {
      if (isUsingMySQL) return mysqlDb.accessCodes.create(accessCode);
      if (!supabase) return mockDb.accessCodes.create(accessCode);
      const { data, error } = await supabase.from("access_codes").insert(accessCode).select();
      if (error) throw error;
      return data?.[0];
    },
    async get(code: string) {
      if (isUsingMySQL) return mysqlDb.accessCodes.get(code);
      if (!supabase) return mockDb.accessCodes.get(code);
      const { data, error } = await supabase.from("access_codes").select("*").eq("code", code).limit(1).single();
      if (error) throw error;
      return data || null;
    },
    async getByMembership(membershipId: string) {
      if (isUsingMySQL) return mysqlDb.accessCodes.getByMembership(membershipId);
      if (!supabase) return mockDb.accessCodes.getByMembership(membershipId);
      const { data, error } = await supabase.from("access_codes").select("*").eq("membership_id", membershipId).limit(1).single();
      if (error) throw error;
      return data || null;
    },
    async listByUser(userId: string) {
      if (isUsingMySQL) return mysqlDb.accessCodes.listByUser(userId);
      if (!supabase) return mockDb.accessCodes.listByUser(userId);
      const { data, error } = await supabase.from("access_codes").select("*").eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    async listAll() {
      if (isUsingMySQL) return mysqlDb.accessCodes.listAll();
      if (!supabase) return mockDb.accessCodes.listAll();
      const { data, error } = await supabase.from("access_codes").select("*");
      if (error) throw error;
      return data || [];
    },
    async markAsUsed(id: string) {
      if (isUsingMySQL) return mysqlDb.accessCodes.markAsUsed(id);
      if (!supabase) return mockDb.accessCodes.markAsUsed(id);
      const { data, error } = await supabase.from("access_codes").update({ is_used: true, used_at: new Date().toISOString() }).eq("id", id).select();
      if (error) throw error;
      return data?.[0] || null;
    },
  },

  discountCodes: {
    async create(discountCode: any) {
      if (isUsingMySQL) return mysqlDb.discountCodes.create(discountCode);
      if (!supabase) return mockDb.discountCodes.create(discountCode);
      const { data, error } = await supabase.from("discount_codes").insert(discountCode).select();
      if (error) throw error;
      return data?.[0];
    },
    async get(code: string) {
      if (isUsingMySQL) return mysqlDb.discountCodes.get(code);
      if (!supabase) return mockDb.discountCodes.get(code);
      const { data, error } = await supabase.from("discount_codes").select("*").eq("code", code).limit(1).single();
      if (error) throw error;
      return data || null;
    },
    async listAll() {
      if (isUsingMySQL) return mysqlDb.discountCodes.listAll();
      if (!supabase) return mockDb.discountCodes.listAll();
      const { data, error } = await supabase.from("discount_codes").select("*");
      if (error) throw error;
      return data || [];
    },
    async listActive() {
      if (isUsingMySQL) return mysqlDb.discountCodes.listActive();
      if (!supabase) return mockDb.discountCodes.listActive();
      const { data, error } = await supabase.from("discount_codes").select("*").gte("expires_at", new Date().toISOString()).eq("is_active", true);
      if (error) throw error;
      return data || [];
    },
    async update(code: string, updates: any) {
      if (isUsingMySQL) return mysqlDb.discountCodes.update(code, updates);
      if (!supabase) return mockDb.discountCodes.update(code, updates);
      const { data, error } = await supabase.from("discount_codes").update(updates).eq("code", code).select();
      if (error) throw error;
      return data?.[0] || null;
    },
    async incrementUses(code: string) {
      if (isUsingMySQL) return mysqlDb.discountCodes.incrementUses(code);
      if (!supabase) return mockDb.discountCodes.incrementUses(code);
      // fetch and increment
      const existing = await db.discountCodes.get(code);
      if (!existing) return null;
      const { data, error } = await supabase
        .from("discount_codes")
        .update({ current_uses: (existing.current_uses || 0) + 1 })
        .eq("code", code)
        .select();
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
