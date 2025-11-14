import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Award, Zap, Heart, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubscriptionMember = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const memberBenefits = [
    {
      icon: Zap,
      title: "Exclusive Pricing",
      description:
        "Get discounted rates on all services, locked in for the duration of your membership.",
    },
    {
      icon: Award,
      title: "Priority Scheduling",
      description:
        "Book appointments at preferred times with priority access to our calendar.",
    },
    {
      icon: Shield,
      title: "Paint Protection",
      description:
        "Extended paint sealant protection keeps your vehicle looking pristine between services.",
    },
    {
      icon: Heart,
      title: "Premium Care",
      description:
        "Every service includes premium products and extra attention to detail.",
    },
  ];

  const membershipTiers = [
    {
      name: "Maintenance - Basic",
      price: "$149.99/month",
      benefits: [
        "Monthly maintenance service",
        "Interior & exterior care",
        "Paint protection",
        "10% discount on extras",
      ],
    },
    {
      name: "Maintenance - Premium",
      price: "$199.99/month",
      benefits: [
        "Bi-monthly full detail",
        "Deep cleaning services",
        "Advanced protection",
        "15% discount on extras",
        "Priority support",
      ],
      featured: true,
    },
    {
      name: "Maintenance - Elite",
      price: "$249.99/month",
      benefits: [
        "Quarterly comprehensive detail",
        "Paint correction service",
        "Premium treatments",
        "20% discount on extras",
        "24/7 concierge support",
      ],
    },
  ];

  const handleScheduleService = () => {
    toast({
      title: "Scheduling Service",
      description: "Redirecting to booking system...",
    });
    // In a real app, this would redirect to a scheduling system
  };

  const handleUpgradePlan = () => {
    setShowUpgradeModal(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" style={{ marginTop: 100 }}>
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden pt-32 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
                <p className="text-primary font-semibold text-sm font-inter">
                  Welcome Back, Member
                </p>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
                Your Membership{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Consistency builds excellence — and our members are proof of it.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Welcome Message */}
        <section className="py-12 bg-gradient-to-r from-card via-primary/10 to-card border-b border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center" ref={ref}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground font-inter leading-relaxed mb-4 text-lg">
                Consistency builds excellence — and our members are proof of it.
              </p>
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

        {/* Member Status Only Dashboard */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-montserrat font-bold">Your Membership Status</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/member-settings')}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="font-semibold">Maintenance - Premium</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Membership Status</p>
                  <p className="font-semibold text-emerald-500">Active</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Payment Status</p>
                  <p className="font-semibold">Paid</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <p className="text-sm text-muted-foreground">Billing</p>
                <p className="font-medium">Monthly • Next billing: 2025-01-15</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Recommended Upgrades</h4>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Ceramic Touch-up</p>
                      <p className="text-sm text-muted-foreground">Add between services to extend protection.</p>
                    </div>
                    <Button className="bg-gradient-primary" onClick={() => toast({ title: 'Upgrade', description: 'Redirecting to upgrade flow...' })}>Upgrade</Button>
                  </li>

                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Elite Upgrade</p>
                      <p className="text-sm text-muted-foreground">Quarterly care + concierge support.</p>
                    </div>
                    <Button className="bg-primary/10 text-primary border border-primary" onClick={() => toast({ title: 'Upgrade', description: 'Redirecting to upgrade flow...' })}>Learn More</Button>
                  </li>
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-3">Send a suggestion</h4>
                <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const name = (fd.get('name') as string) || 'Anonymous'; const email = (fd.get('email') as string) || ''; const message = (fd.get('message') as string) || ''; if(!message || message.trim().length < 5){ toast({ title: 'Message too short', description: 'Please enter a longer message.' }); return; } toast({ title: 'Thanks!', description: 'Your suggestion was received.' }); (e.currentTarget as HTMLFormElement).reset(); }} className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <input name="name" placeholder="Your name" className="input bg-background border-border rounded-md p-2 w-full" />
                    <input name="email" placeholder="Email (optional)" type="email" className="input bg-background border-border rounded-md p-2 w-full" />
                  </div>
                  <textarea name="message" placeholder="Tell us your suggestion" className="input bg-background border-border rounded-md p-2 w-full h-28" />
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-gradient-primary">Send Suggestion</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SubscriptionMember;
