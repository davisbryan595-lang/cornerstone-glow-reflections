import { getSupabase } from "@/lib/supabase";

export async function createMembershipRecord(params: {
  userId: string;
  planId: string;
  accessCode: string;
  paymentStatus?: "paid" | "unpaid" | "refunded";
  status?: "active" | "canceled" | "past_due" | "trialing";
  nextBillingAt?: string | null;
}) {
  const supabase = getSupabase();
  const now = new Date().toISOString();
  const { error } = await supabase.from("memberships").upsert({
    user_id: params.userId,
    plan_id: params.planId,
    status: params.status ?? "active",
    payment_status: params.paymentStatus ?? "paid",
    access_code: params.accessCode,
    next_billing_at: params.nextBillingAt ?? null,
    start_date: now,
  }).eq("user_id", params.userId);
  if (error) throw error;
}
