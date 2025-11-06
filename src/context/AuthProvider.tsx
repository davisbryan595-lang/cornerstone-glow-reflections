import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import db, { isUsingSupabase } from "@/lib/database";

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

  const supabase = useMemo(() => {
    try {
      return getSupabase();
    } catch (e) {
      return null as any;
    }
  }, []);

  const isUsingMockDb = !isUsingSupabase;

  async function loadUser() {
    setLoading(true);
    try {
      let user: { id: string; email?: string | null } | null = null;

      if (isUsingMockDb) {
        // For mock DB, we'll use localStorage to track the current user
        const storedUserId = localStorage.getItem("currentUserId");
        if (storedUserId) {
          const prof = await db.profiles.get(storedUserId);
          if (prof) {
            user = { id: storedUserId, email: prof.email };
          }
        }
      } else if (supabase) {
        // Use Supabase
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user ? { id: session.user.id, email: session.user.email } : null;
      } else {
        // Using MySQL with custom auth (email only mock login)
        user = null;
      }

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
    loadUser();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      loadUser();
    });
    return () => {
      sub?.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const value: AuthState = {
    loading,
    sessionUser,
    profile,
    membership,
    isMember: Boolean(membership && membership.status === "active"),
    isAdmin: profile?.role === "admin",
    signOut: async () => {
      if (isUsingMockDb) {
        localStorage.removeItem("currentUserId");
        await loadUser();
      } else if (supabase) {
        await supabase.auth.signOut();
        await loadUser();
      }
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
