import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import db, { validateAndGetDiscount } from "@/lib/database";
import { MEMBERSHIP_PLANS } from "@/lib/payment";
import { calculateCheckoutSummary, formatPrice } from "@/lib/discountCodeManager";
import { generateAccessCode, generateAccessCodeBatch } from "@/lib/accessCodeGenerator";
import { generateCouponBatch } from "@/lib/discountCodeManager";
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

      // Create membership record
      const now = new Date().toISOString();
      const nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const membershipId = `membership-${Date.now()}`;

      const membership = {
        id: membershipId,
        user_id: sessionUser.id,
        plan_id: planId,
        status: "active" as const,
        payment_status: "paid" as const,
        access_code: generateAccessCode(),
        next_billing_at: nextBilling,
        start_date: now,
        end_date: null,
      };

      await db.memberships.upsert(membership);

      // Create an access code for this membership
      const accessCode = generateAccessCode();
      await db.accessCodes.create({
        code: accessCode,
        user_id: sessionUser.id,
        membership_id: membershipId,
        plan_id: planId,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_used: true,
        used_at: now,
      });

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

      toast({ title: "Success!", description: "Your membership is now active" });
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
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <h1 className="text-4xl font-montserrat font-bold mb-2">Complete Your Purchase</h1>
            <p className="text-muted-foreground mb-8">Secure checkout for your membership</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <p className="font-semibold">{plan.planName}</p>
                        <p className="text-sm text-muted-foreground">Monthly subscription</p>
                      </div>
                      <p className="font-semibold">{formatPrice(plan.amount)}</p>
                    </div>

                    {summary.discountPercentage > 0 && (
                      <div className="flex justify-between items-center pb-4 border-b text-green-600">
                        <div>
                          <p className="font-semibold">{summary.discountPercentage}% Discount</p>
                          <p className="text-sm">{appliedDiscount?.code}</p>
                        </div>
                        <p className="font-semibold">-{formatPrice(summary.discountAmount)}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lg pt-2">
                      <p className="font-bold">Total</p>
                      <p className="font-bold">{formatPrice(summary.finalPrice)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Apply Discount Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value.toUpperCase());
                          setDiscountValid(false);
                        }}
                        disabled={discountValid || validationLoading}
                      />
                      <Button onClick={handleValidateDiscount} disabled={validationLoading || discountValid} variant="outline">
                        {validationLoading ? "Validating..." : "Apply"}
                      </Button>
                    </div>
                    {discountValid && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">Discount code applied successfully!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={sessionUser?.email || ""} disabled className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="123 Main St" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="card">Card Number</Label>
                      <Input id="card" placeholder="4242 4242 4242 4242" className="mt-1 font-mono" />
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <Label htmlFor="expiry">Expiry</Label>
                          <Input id="expiry" placeholder="MM/YY" className="mt-1 font-mono" />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" className="mt-1 font-mono" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(plan.amount)}</span>
                      </div>
                      {summary.discountPercentage > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({summary.discountPercentage}%)</span>
                          <span>-{formatPrice(summary.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(summary.finalPrice)}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-primary" size="lg" onClick={handleCheckout} disabled={loading}>
                      {loading ? "Processing..." : `Pay ${formatPrice(summary.finalPrice)}`}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      In demo mode, any card details work. Your membership will be activated immediately.
                    </p>
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
