import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Check, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { sendSubscriptionEmail } from "@/lib/email";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

interface MaintenancePlan {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface FrequencyOption {
  id: string;
  label: string;
  weeks?: number;
  months?: number;
}

interface SubscriptionForm {
  serviceType: string;
  tier: string;
  frequency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleInfo: string;
  additionalNotes: string;
}

const MaintenancePlans = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
  const { isMember, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SubscriptionForm>({
    serviceType: "",
    tier: "",
    frequency: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    vehicleInfo: "",
    additionalNotes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const servicePlans: MaintenancePlan[] = [
    {
      id: "exterior",
      name: "Exterior Detail",
      description:
        "Professional hand wash, clay bar treatment, ceramic sealant, wheel detailing, and tire dressing",
      icon: "🚗",
    },
    {
      id: "interior",
      name: "Interior Detail",
      description:
        "Deep vacuum, wipe down, leather conditioning, window cleaning, and air freshening",
      icon: "��",
    },
    {
      id: "full",
      name: "Full Detail",
      description:
        "Complete interior and exterior service for ultimate shine and protection",
      icon: "✨",
    },
  ];

  const tiers = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential maintenance service",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Enhanced service with additional treatments",
    },
  ];

  const frequencies: FrequencyOption[] = [
    { id: "weekly-1", label: "Every 1 week", weeks: 1 },
    { id: "biweekly", label: "Bi-weekly (Every 2 weeks)", weeks: 2 },
    { id: "weekly-3", label: "Every 3 weeks", weeks: 3 },
    { id: "weekly-4", label: "Every 4 weeks", weeks: 4 },
    { id: "monthly", label: "Monthly", months: 1 },
    { id: "quarterly", label: "Every 3 months", months: 3 },
    { id: "semi-annual", label: "Every 6 months", months: 6 },
    { id: "annual", label: "Once a year", months: 12 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.serviceType ||
      !formData.tier ||
      !formData.frequency ||
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare subscription details
      const selectedService = servicePlans.find(
        (s) => s.id === formData.serviceType
      );
      const selectedTier = tiers.find((t) => t.id === formData.tier);
      const selectedFrequency = frequencies.find(
        (f) => f.id === formData.frequency
      );

      const subscriptionDetails = {
        serviceType: selectedService?.name,
        tier: selectedTier?.name,
        frequency: selectedFrequency?.label,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        vehicleInfo: formData.vehicleInfo,
        additionalNotes: formData.additionalNotes,
        submittedAt: new Date().toISOString(),
      };

      // Send email notification to business owner via webhook or API
      const emailResult = await sendSubscriptionEmail(subscriptionDetails);
      if (!emailResult.ok && emailResult.status !== 404) {
        throw new Error("Failed to send confirmation");
      }

      // Show success message
      toast({
        title: "Subscription Request Received! ✓",
        description: `Thank you, ${formData.customerName}! We'll confirm your ${selectedService?.name} ${selectedTier?.name} plan at ${formData.customerEmail}. We'll be in touch within 24 hours to book your first appointment.`,
      });

      // Log the subscription details for development
      console.log("Subscription Details:", subscriptionDetails);

      setSubmitted(true);
      setFormData({
        serviceType: "",
        tier: "",
        frequency: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        vehicleInfo: "",
        additionalNotes: "",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error processing your request. Please try again or call us at 980-312-4236.",
        variant: "destructive",
      });
    }
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
                Maintenance Plans{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Subscriptions
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Keep your vehicle looking pristine with our convenient maintenance
                subscription plans. Choose your service, tier, and frequency.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Selection */}
        <section ref={ref} className="py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
                Choose Your Service
              </h2>
              <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
                Select the type of maintenance service that best fits your needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              {servicePlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() =>
                    setFormData({ ...formData, serviceType: plan.id })
                  }
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    formData.serviceType === plan.id
                      ? "border-primary bg-primary/10 shadow-glow-primary"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="text-5xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-montserrat font-bold mb-2 text-primary">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-inter mb-4">
                    {plan.description}
                  </p>
                  {formData.serviceType === plan.id && (
                    <div className="flex items-center gap-2 text-primary">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-semibold">Selected</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-montserrat font-bold mb-8">
                {submitted ? "✓ Subscription Submitted!" : "Complete Your Subscription"}
              </h2>

              {!submitted ? (
                <div className="space-y-8">
                  {/* Tier Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Service Tier *
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tiers.map((tier) => (
                        <motion.button
                          key={tier.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          onClick={() =>
                            setFormData({ ...formData, tier: tier.id })
                          }
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.tier === tier.id
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:border-primary/50"
                          }`}
                        >
                          <p className="font-semibold text-primary">{tier.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tier.description}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Service Frequency *
                    </label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, frequency: value })
                      }
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select how often you'd like service" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq.id} value={freq.id}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border pt-8">
                    <h3 className="text-xl font-montserrat font-bold mb-6">
                      Your Information
                    </h3>

                    {/* Name */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.customerEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerEmail: e.target.value,
                          })
                        }
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>

                    {/* Phone */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="(980) 312-4236"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerPhone: e.target.value,
                          })
                        }
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>

                    {/* Vehicle Info */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2">
                        Vehicle Information
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., 2020 Toyota Camry, Blue"
                        value={formData.vehicleInfo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleInfo: e.target.value,
                          })
                        }
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>

                    {/* Additional Notes */}
                    <div className="mb-8">
                      <label className="block text-sm font-semibold mb-2">
                        Additional Notes or Requests
                      </label>
                      <Textarea
                        placeholder="Let us know any special requests or details about your vehicle..."
                        value={formData.additionalNotes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalNotes: e.target.value,
                          })
                        }
                        className="bg-background border-border focus:border-primary"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:shadow-glow-primary py-6 text-base font-semibold"
                  >
                    Confirm Subscription Request
                  </Button>

                  <p className="text-xs text-muted-foreground text-center font-inter">
                    We'll send you a confirmation email and contact you within 24 hours
                    to book your first appointment.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <p className="text-lg text-muted-foreground font-inter">
                    Thank you for choosing Cornerstone Mobile Detailing!
                  </p>
                  <p className="text-sm text-muted-foreground font-inter mt-2">
                    Check your email for confirmation details.
                  </p>
                </div>
              )}
            </motion.form>
          </div>
        </section>

        {/* Membership Callout */}
        <section className="py-12 bg-gradient-to-r from-primary/6 to-background border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card border border-border rounded-2xl">
              <div className="flex-1">
                <h3 className="text-2xl font-montserrat font-bold mb-2">Prefer convenience?</h3>
                <p className="text-muted-foreground mb-4">Memberships offer recurring scheduled maintenance, priority booking, and member-only savings. If you want regular service with less hassle, consider joining our Membership Program.</p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li>• Predictable scheduling and reminders</li>
                  <li>• Priority access to booking windows</li>
                  <li>• Member-only discounts and perks</li>
                </ul>
                <div className="flex gap-3">
                  <Button className="bg-gradient-primary" onClick={() => window.location.href='/membership'}>Learn About Membership</Button>
                  <Button variant="outline" onClick={() => window.location.href='/subscription'}>Keep Using Maintenance Plans</Button>
                </div>
              </div>
              <div className="w-full md:w-56">
                <img src="/placeholder.svg" alt="membership" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20 bg-card/30 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Easy Scheduling",
                  description:
                    "We'll work with you to find the perfect time for your service.",
                },
                {
                  title: "Flexible Plans",
                  description:
                    "Pause, modify, or cancel your subscription anytime.",
                },
                {
                  title: "Best Value",
                  description:
                    "Save up to 20% with regular maintenance subscriptions.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-3">
                    {index === 0 ? "📅" : index === 1 ? "⚙️" : "💰"}
                  </div>
                  <h3 className="font-montserrat font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-inter">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MaintenancePlans;
