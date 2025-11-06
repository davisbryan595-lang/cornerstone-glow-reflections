import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import db, { isUsingSupabase } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Auth: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = params.get("next") || "/subscription-member";
  const { toast } = useToast();

  const supabase = useMemo(() => {
    try {
      return getSupabase();
    } catch {
      return null;
    }
  }, []);

  const isUsingMockDb = !isUsingSupabase;

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);

  async function upsertProfile(userId: string, emailVal?: string | null, marketing?: boolean) {
    if (isUsingMockDb) {
      await db.profiles.upsert({
        user_id: userId,
        email: emailVal,
        marketing_opt_in: marketing,
        role: "user",
      });
    } else {
      await supabase.from("profiles").upsert({ user_id: userId, email: emailVal, marketing_opt_in: marketing ?? undefined }).eq("user_id", userId);
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email || !password) {
        toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" as any });
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        if (isUsingMockDb) {
          // For mock DB, generate a simple user ID
          const userId = `user-${Date.now()}`;
          await upsertProfile(userId, email, marketingOptIn);
          localStorage.setItem("currentUserId", userId);
          toast({ title: "Success!", description: "Account created. Redirecting..." });
          setTimeout(() => {
            window.location.href = next;
          }, 500);
        } else {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          const user = data.user;
          if (user) await upsertProfile(user.id, user.email, marketingOptIn);
          navigate(next, { replace: true });
        }
      } else {
        if (isUsingMockDb) {
          // For mock DB, find user by email
          const profiles = await mockDb.profiles.list();
          const userProfile = profiles.find((p) => p.email === email);
          if (!userProfile) {
            toast({ title: "Authentication error", description: "Email not found", variant: "destructive" as any });
          } else {
            localStorage.setItem("currentUserId", userProfile.user_id);
            toast({ title: "Success!", description: "Logged in. Redirecting..." });
            setTimeout(() => {
              window.location.href = next;
            }, 500);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          const user = data.user;
          if (user) {
            toast({ title: "Enable notifications?", description: "Get emails about offers and updates.", action: (
              <Button onClick={async () => { await upsertProfile(user.id, user.email, true); toast({ title: "Notifications enabled" }); }}>Enable</Button>
            ) });
          }
          navigate(next, { replace: true });
        }
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // no-op; could check existing session and redirect
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-montserrat font-bold">{mode === "login" ? "Login" : "Create account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {mode === "signup" && (
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" checked={marketingOptIn} onCheckedChange={(v) => setMarketingOptIn(Boolean(v))} />
                <Label htmlFor="marketing" className="text-sm text-muted-foreground">Email me offers and updates</Label>
              </div>
            )}
            <Button className="w-full" type="submit" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}</Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4">
            {mode === "login" ? (
              <button className="underline" onClick={() => setMode("signup")}>New here? Create an account</button>
            ) : (
              <button className="underline" onClick={() => setMode("login")}>Have an account? Login</button>
            )}
          </div>
          {isUsingMockDb && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Demo Mode:</strong> Try logging in with <code>member@example.com</code> to see the member dashboard, or sign up with a new email.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
