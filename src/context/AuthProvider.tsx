import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import db from "@/lib/database";

export type Profile = {
  id?: string;
  user_id: string;
  email?: string | null;
  role?: "user" | "admin" | null;
  marketing_opt_in?: boolean | null;
  created_at?: string;
};

export type Membership = {
  id?: string;
  user_id: string;
  plan_id?: string | null;
  status?: "active" | "canceled" | "past_due" | "trialing" | null;
  payment_status?: "paid" | "unpaid" | "refunded" | null;
  access_code?: string | null;
  next_billing_at?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type AuthState = {
  loading: boolean;
  sessionUser: { id: string; email?: string | null } | null;
  profile: Profile | null;
  membership: Membership | null;
  isMember: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<AuthState["sessionUser"]>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);

  async function loadUser() {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ? { id: session.user.id, email: session.user.email } : null;
      setSessionUser(user);

      if (user) {
        const prof = await db.profiles.get(user.id);
        setProfile(prof ?? null);

        const member = await db.memberships.getActive(user.id);
        setMembership(member ?? null);
      } else {
        setProfile(null);
        setMembership(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await loadUser();
    })();

    const supabase = getSupabase();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      loadUser();
    });

    return () => {
      sub?.subscription.unsubscribe();
    };
  }, []);

  const value: AuthState = {
    loading,
    sessionUser,
    profile,
    membership,
    isMember: Boolean(membership && membership.status === "active"),
    isAdmin: profile?.role === "admin",
    signOut: async () => {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      await loadUser();
    },
    refresh: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
