import { generateAccessCode } from "./accessCodeGenerator";
import db from "./database";
import { sendMembershipConfirmationEmail } from "./membershipEmail";

export interface MembershipCreationData {
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  planName: string;
  monthlyPrice: number;
  paymentStatus?: string;
  usedAccessCode?: string;
}

/**
 * Create a new membership and assign an access code to the user
 * Sends a confirmation email with the access code
 */
export async function createMembershipWithAccessCode(data: MembershipCreationData) {
  const now = new Date().toISOString();
  const membershipId = `membership-${Date.now()}`;

  try {
    // Create the membership record
    const membership = await db.memberships.upsert({
      id: membershipId,
      user_id: data.userId,
      plan_id: data.planId,
      status: "active",
      payment_status: data.paymentStatus || "paid",
      access_code: data.usedAccessCode || null,
      start_date: now,
      next_billing_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Generate and assign a new access code for this member
    const accessCode = generateAccessCode();
    const newAccessCodeRecord = await db.accessCodes.create({
      code: accessCode,
      user_id: data.userId,
      membership_id: membershipId,
      plan_id: data.planId,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      is_used: true,
      used_at: now,
    });

    // Send confirmation email with access code
    const emailResult = await sendMembershipConfirmationEmail({
      customerName: data.userName,
      customerEmail: data.userEmail,
      planName: data.planName,
      accessCode: accessCode,
      monthlyPrice: data.monthlyPrice,
      startDate: now,
    });

    return {
      success: true,
      membership,
      accessCode: newAccessCodeRecord,
      emailSent: emailResult.ok,
    };
  } catch (error) {
    console.error("Error creating membership with access code:", error);
    throw error;
  }
}

/**
 * Get all members with their assigned access codes
 */
export async function getAllMembersWithAccessCodes() {
  try {
    const memberships = await db.memberships.listActive();
    const accessCodes = await db.accessCodes.listAll();
    const profiles = await db.profiles.list();

    // Create a map of membership IDs to access codes
    const codesByMembership: { [key: string]: any } = {};
    accessCodes.forEach((code) => {
      if (code.membership_id && code.is_used) {
        codesByMembership[code.membership_id] = code;
      }
    });

    // Combine membership, profile, and access code info
    const membersWithCodes = memberships.map((membership) => {
      const profile = profiles.find((p) => p.user_id === membership.user_id);
      const accessCode = codesByMembership[membership.id];

      return {
        user_id: membership.user_id,
        email: profile?.email || "N/A",
        plan_id: membership.plan_id,
        status: membership.status,
        access_code: accessCode?.code || "N/A",
        start_date: membership.start_date,
        next_billing_at: membership.next_billing_at,
      };
    });

    return membersWithCodes;
  } catch (error) {
    console.error("Error fetching members with access codes:", error);
    return [];
  }
}
