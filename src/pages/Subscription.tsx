import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalPrice, processPayment, generateAccessCode } from "@/lib/payment";
import { useAuth } from "@/context/AuthProvider";
import { createMembershipRecord } from "@/lib/membership";
import { useNavigate } from "react-router-dom";

interface SubscriptionState {
  hasAccessCode: boolean;
  accessCode: string;
  selectedPlan: string | null;
  paymentFrequency: "monthly" | "full";
  agreedToTerms: boolean;
}

const Subscription = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
  const [state, setState] = useState<SubscriptionState>({
    hasAccessCode: false,
    accessCode: "",
    selectedPlan: null,
    paymentFrequency: "monthly",
    agreedToTerms: false,
  });

  const membershipPlans = [
    {
      id: "maintenance-basic",
      name: "Maintenance - Basic",
      frequency: "Monthly",
      monthlyPrice: 149.99,
      fullPrice: 429.97,
      description:
        "Keep your vehicle looking fresh with regular maintenance washes. Perfect for customers who want consistent care at an affordable price.",
      includes: [
        "Monthly interior detail maintenance",
        "Monthly exterior wash and protection",
        "Premium tire dressing",
        "Trim coating and dressing",
        "Priority scheduling",
        "10% off additional services",
      ],
    },
    {
      id: "maintenance-premium",
      name: "Maintenance - Premium",
      frequency: "Bi-Monthly",
      monthlyPrice: 199.99,
      fullPrice: 599.97,
      description:
        "Elevate your vehicle's care with our premium maintenance plan. Bi-monthly service for superior results and extended protection.",
      includes: [
        "Bi-monthly full detail service",
        "Deep interior and exterior cleaning",
        "3-month paint sealant protection",
        "Ceramic coating touch-up",
        "Premium tire and trim treatment",
        "Priority booking and support",
        "15% off additional services",
      ],
      featured: true,
    },
    {
      id: "maintenance-elite",
      name: "Maintenance - Elite",
      frequency: "Seasonal",
      monthlyPrice: 249.99,
      fullPrice: 749.97,
      description:
        "Our most comprehensive membership for those who demand excellence. Quarterly service with all premium treatments included.",
      includes: [
        "Quarterly comprehensive detail service",
        "Full interior deep clean and protection",
        "Professional paint correction and polish",
        "6-month ceramic coating protection",
        "Engine bay detailing",
        "O-zone treatment",
        "Premium leather conditioning",
        "24/7 concierge support",
        "20% off additional services",
      ],
    },
  ];

  const handleAccessCodeSubmit = (code: string) => {
    // Validate access code (in a real app, this would be verified against the database)
    if (code.length > 0) {
      setState({ ...state, hasAccessCode: true, accessCode: code });
      toast({
        title: "Access Granted",
        description: "Welcome back! You can now manage your subscription.",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid access code.",
      });
    }
  };

  const handleSelectPlan = (planId: string) => {
    setState({ ...state, selectedPlan: planId });
  };

  const handlePaymentFrequencyChange = (frequency: "monthly" | "full") => {
    setState({ ...state, paymentFrequency: frequency });
  };

  const handleCheckout = async () => {
    if (!state.selectedPlan) {
      toast({
        title: "Select a Plan",
        description: "Please select a membership plan before checkout.",
      });
      return;
    }

    if (!state.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms & Conditions to proceed.",
      });
      return;
    }

    const selectedPlanData = membershipPlans.find(
      (p) => p.id === state.selectedPlan
    );

    toast({
      title: "Processing Payment",
      description: "Preparing your checkout...",
    });

    // Process payment
    const paymentResult = await processPayment({
      planId: state.selectedPlan,
      customerId: "customer-123", // In a real app, this would be the logged-in user's ID
      email: "customer@example.com", // In a real app, this would be the user's email
      paymentFrequency: state.paymentFrequency,
      agreedToTerms: state.agreedToTerms,
    });

    if (paymentResult.success) {
      // Generate unique access code for member
      const accessCode = generateAccessCode();

      toast({
        title: "Payment Processed",
        description: `Subscription confirmed! Your access code: ${accessCode}`,
      });

      // In a real implementation, redirect to Stripe checkout
      // or success page
      // window.location.href = `/payment-success?code=${accessCode}`;
    } else {
      toast({
        title: "Payment Failed",
        description:
          paymentResult.error || "Unable to process payment. Please try again.",
      });
    }
  };

  const getSelectedPlanPrice = () => {
    const plan = membershipPlans.find((p) => p.id === state.selectedPlan);
    if (!plan) return 0;

    if (state.paymentFrequency === "full") {
      return (plan.fullPrice * 0.93).toFixed(2); // 7% discount
    }
    return plan.monthlyPrice.toFixed(2);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" style={{ marginTop: 100 }}>
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
                Membership{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Programs
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Consistency builds excellence — and our members are proof of it.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Access Code Section */}
        {!state.hasAccessCode && (
          <section className="py-16 bg-card/50 border-b border-border">
            <div className="container mx-auto px-4 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-primary/30 rounded-2xl p-8 flex items-start gap-4"
              >
                <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-montserrat font-bold mb-2">
                    Existing Member?
                  </h3>
                  <p className="text-muted-foreground mb-4 font-inter">
                    Enter your access code to view your personalized membership
                    details and benefits.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter your access code"
                      value={state.accessCode}
                      onChange={(e) =>
                        setState({ ...state, accessCode: e.target.value })
                      }
                      className="bg-background border-border focus:border-primary"
                    />
                    <Button
                      onClick={() => handleAccessCodeSubmit(state.accessCode)}
                      className="bg-gradient-primary hover:shadow-glow-primary"
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Welcome Message */}
        <section className="py-12 bg-gradient-to-r from-card via-primary/10 to-card border-b border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              ref={ref}
            >
              <p className="text-muted-foreground font-inter leading-relaxed mb-4">
                At Cornerstone, we believe stewardship honors the blessings
                we've been given. Every wash, polish, and restoration is done
                with integrity — not just to keep your vehicle clean, but to
                serve with purpose.
              </p>
              <p className="text-muted-foreground font-inter leading-relaxed">
                Our members experience more than convenience; they experience
                peace of mind, knowing their investment is cared for by hands
                guided with faith, excellence, and consistency. Because when
                something is maintained with devotion, it doesn't just shine —
                it endures.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
                Choose Your Plan
              </h2>
              <p className="text-muted-foreground font-inter">
                Select the membership that best fits your vehicle maintenance
                needs
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`bg-card border rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col ${
                    state.selectedPlan === plan.id
                      ? "border-primary shadow-glow-primary"
                      : "border-border hover:border-primary/50"
                  } ${plan.featured ? "lg:scale-105" : ""}`}
                >
                  {plan.featured && (
                    <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-2 rounded-lg mb-4 text-center">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 font-inter">
                    {plan.frequency} Service
                  </p>

                  <div className="mb-6">
                    <p className="text-3xl font-montserrat font-bold text-primary">
                      ${plan.monthlyPrice}
                    </p>
                    <p className="text-xs text-muted-foreground font-inter">
                      per billing cycle
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 font-inter">
                    {plan.description}
                  </p>

                  <div className="flex-1 mb-6">
                    <h4 className="text-sm font-semibold mb-3 font-inter">
                      What's Included:
                    </h4>
                    <ul className="space-y-2">
                      {plan.includes.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-muted-foreground flex items-start gap-2 font-inter"
                        >
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`w-full py-2 rounded-lg text-center text-sm font-semibold transition-all duration-300 ${
                      state.selectedPlan === plan.id
                        ? "bg-gradient-primary text-primary-foreground"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {state.selectedPlan === plan.id ? "✓ Selected" : "Select Plan"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment & Checkout */}
        {state.selectedPlan && (
          <section className="py-20 bg-card/30 border-t border-border">
            <div className="container mx-auto px-4 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <h3 className="text-2xl font-montserrat font-bold mb-6">
                  Payment Options
                </h3>

                <div className="space-y-4 mb-8">
                  <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all">
                    <input
                      type="radio"
                      name="frequency"
                      value="monthly"
                      checked={state.paymentFrequency === "monthly"}
                      onChange={() =>
                        handlePaymentFrequencyChange("monthly")
                      }
                      className="w-4 h-4 mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold font-inter">Pay Monthly</p>
                      <p className="text-sm text-muted-foreground font-inter">
                        Pay ${getSelectedPlanPrice()} for each billing cycle
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition-all bg-primary/5">
                    <input
                      type="radio"
                      name="frequency"
                      value="full"
                      checked={state.paymentFrequency === "full"}
                      onChange={() => handlePaymentFrequencyChange("full")}
                      className="w-4 h-4 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold font-inter">
                          Pay in Full (3 Cycles)
                        </p>
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Save 7%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter">
                        Pay ${getSelectedPlanPrice()} for all three billing
                        cycles
                      </p>
                    </div>
                  </label>
                </div>

                <div className="border-t border-border pt-6 mb-6">
                  <div className="flex justify-between mb-2 font-inter">
                    <span>Subtotal:</span>
                    <span>${getSelectedPlanPrice()}</span>
                  </div>
                  <div className="flex justify-between mb-2 font-inter">
                    <span>Taxes & Fees:</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-montserrat font-bold text-lg">
                    <span>Total:</span>
                    <span>${getSelectedPlanPrice()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-start gap-3 p-4 bg-card/50 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all">
                    <Checkbox
                      checked={state.agreedToTerms}
                      onCheckedChange={(checked) =>
                        setState({
                          ...state,
                          agreedToTerms: checked as boolean,
                        })
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-inter leading-relaxed">
                        I agree to the{" "}
                        <a
                          href="#terms"
                          className="text-primary hover:underline"
                        >
                          Terms & Conditions
                        </a>{" "}
                        for this membership plan and understand the billing
                        and cancellation policies.
                      </p>
                    </div>
                  </label>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={!state.agreedToTerms}
                  className="w-full bg-gradient-primary hover:shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed py-6 text-base font-semibold"
                >
                  Proceed to Payment
                </Button>
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Subscription;
