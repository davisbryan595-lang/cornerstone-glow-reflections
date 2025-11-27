import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import db, { validateAndGetDiscount } from "@/lib/database";
import { MEMBERSHIP_PLANS } from "@/lib/payment";
import { calculateCheckoutSummary, formatPrice } from "@/lib/discountCodeManager";
import { generateAccessCode, generateAccessCodeBatch } from "@/lib/accessCodeGenerator";
import { generateCouponBatch } from "@/lib/discountCodeManager";
import { sendMembershipConfirmationEmail } from "@/lib/membershipEmail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StripePaymentForm from "@/components/StripePaymentForm";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessionUser, refresh } = useAuth();
  const { toast } = useToast();

  const planId = searchParams.get("plan") || "maintenance-premium";
  const plan = MEMBERSHIP_PLANS[planId as keyof typeof MEMBERSHIP_PLANS];

  const [discountCode, setDiscountCode] = useState("");
  const [discountValid, setDiscountValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);

  const supabase = useMemo(() => {
    try {
      const { getSupabase } = require("@/lib/supabase");
      return getSupabase();
    } catch {
      return null;
    }
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Plan not found</h1>
          <Button onClick={() => navigate("/subscription")} className="mt-4">
            Back to Subscription
          </Button>
        </div>
      </div>
    );
  }

  const summary = calculateCheckoutSummary(planId, discountValid ? discountCode : undefined);

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) {
      toast({ title: "Error", description: "Please enter a discount code", variant: "destructive" as any });
      return;
    }

    setValidationLoading(true);
    try {
      const result = await validateAndGetDiscount(discountCode.toUpperCase(), planId);
      if (result.valid && result.discount) {
        setDiscountValid(true);
        setAppliedDiscount(result.discount);
        toast({ title: "Success", description: `Discount code applied! You save ${formatPrice(result.discount.discount_percentage * (plan.amount / 100))}` });
      } else {
        setDiscountValid(false);
        setAppliedDiscount(null);
        toast({ title: "Invalid Code", description: result.error || "This discount code is not valid", variant: "destructive" as any });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to validate discount code", variant: "destructive" as any });
    } finally {
      setValidationLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    if (!sessionUser) {
      navigate(`/auth?next=${encodeURIComponent(`/checkout?plan=${planId}`)}`);
      return;
    }

    setLoading(true);
    try {
      // Create checkout session with Stripe
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planName: plan.planName,
          amount: summary.finalPrice,
          email: sessionUser.email,
          customerId: sessionUser.id,
          paymentMethodId,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error('Failed to create checkout session');
      }

      const checkoutData = await checkoutResponse.json();

      if (!checkoutData.success) {
        throw new Error(checkoutData.error || 'Checkout failed');
      }

      // Get user profile for name
      const userProfile = await db.profiles.get(sessionUser.id);
      const userName = userProfile?.email?.split("@")[0] || "Member";

      // Create membership record
      const now = new Date().toISOString();
      const nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const membershipId = `membership-${Date.now()}`;

      // Generate access code for this membership
      const accessCode = generateAccessCode();

      const membership = {
        id: membershipId,
        user_id: sessionUser.id,
        plan_id: planId,
        status: "active" as const,
        payment_status: "paid" as const,
        access_code: accessCode,
        next_billing_at: nextBilling,
        start_date: now,
        end_date: null,
      };

      await db.memberships.upsert(membership);

      // Create access code record for this membership
      await db.accessCodes.create({
        code: accessCode,
        user_id: sessionUser.id,
        membership_id: membershipId,
        plan_id: planId,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_used: true,
        used_at: now,
      });

      // Send membership confirmation email with access code
      try {
        await sendMembershipConfirmationEmail({
          customerName: userName,
          customerEmail: sessionUser.email || "",
          planName: plan.planName,
          accessCode: accessCode,
          monthlyPrice: plan.amount,
          startDate: now,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Continue with membership creation even if email fails
      }

      // Generate and assign a discount code for future use
      const tierMap: { [key: string]: string } = {
        "maintenance-basic": "basic",
        "maintenance-premium": "premium",
        "maintenance-elite": "elite",
      };
      const discountTier = tierMap[planId] || "basic";
      const discountPercentages = { basic: 10, premium: 20, elite: 25, referral: 15 };
      const tierNames = { basic: "Basic", premium: "Premium", elite: "Elite", referral: "Referral" };

      // Generate one discount code for the member
      const discountCodes = generateCouponBatch(discountTier, 1);
      const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      for (const discountCode of discountCodes) {
        await db.discountCodes.create({
          code: discountCode,
          plan_id: planId,
          discount_percentage: discountPercentages[discountTier as keyof typeof discountPercentages] || 10,
          description: `${tierNames[discountTier as keyof typeof tierNames]} member discount`,
          max_uses: 1,
          current_uses: 0,
          expires_at: expiryDate,
          is_active: true,
        });
      }

      if (discountValid && appliedDiscount) {
        await db.discountCodes.incrementUses(appliedDiscount.code);
      }

      await refresh();

      toast({
        title: "Success!",
        description: "Your membership is now active! Check your email for your access code."
      });
      navigate("/subscription-member");
    } catch (error) {
      console.error("Payment error:", error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to process payment", variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  if (!summary) {
    return <div>Error loading plan</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" style={{ marginTop: 100 }}>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-3">Complete Your Purchase</h1>
              <p className="text-lg text-muted-foreground">Secure checkout for your membership</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-8">
                    <div className="flex justify-between items-center pb-6 border-b border-border/30">
                      <div className="space-y-1">
                        <p className="font-semibold text-lg text-foreground">{plan.planName}</p>
                        <p className="text-sm text-muted-foreground">Monthly subscription</p>
                      </div>
                      <p className="font-semibold text-lg">{formatPrice(plan.amount)}</p>
                    </div>

                    {summary.discountPercentage > 0 && (
                      <div className="flex justify-between items-center pb-6 border-b border-border/30">
                        <div className="space-y-1">
                          <p className="font-semibold text-lg text-accent">{summary.discountPercentage}% Discount</p>
                          <p className="text-sm text-muted-foreground">Code: {appliedDiscount?.code}</p>
                        </div>
                        <p className="font-semibold text-lg text-accent">-{formatPrice(summary.discountAmount)}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                      <p className="text-xl font-bold text-foreground">Total</p>
                      <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{formatPrice(summary.finalPrice)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">Apply Discount Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-8">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value.toUpperCase());
                          setDiscountValid(false);
                        }}
                        disabled={discountValid || validationLoading}
                        className="flex-1 h-11"
                      />
                      <Button
                        onClick={handleValidateDiscount}
                        disabled={validationLoading || discountValid}
                        variant="outline"
                        className="px-6 h-11 font-semibold"
                      >
                        {validationLoading ? "Validating..." : "Apply"}
                      </Button>
                    </div>
                    {discountValid && (
                      <div className="flex items-center gap-3 p-4 bg-card border border-accent/30 rounded-lg animate-fade-in">
                        <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-accent font-medium">Discount code applied successfully!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={sessionUser?.email || ""}
                        disabled
                        className="h-11 bg-muted/30 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-3 pt-2 border-t border-border/30">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Payment will be processed securely using Stripe.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Your billing details will be securely stored and never shared with third parties.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-32 border-border/50 shadow-lg">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-2xl">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <StripePaymentForm
                      amount={summary.finalPrice}
                      planName={plan.planName}
                      onSuccess={handlePaymentSuccess}
                      isLoading={loading}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
