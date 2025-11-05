import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Award, Zap, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const SubscriptionMember = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
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

        {/* Quick Actions */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                onClick={handleScheduleService}
                className="group relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-left hover:shadow-glow-primary transition-all duration-300"
              >
                <div className="relative z-10">
                  <p className="text-primary-foreground/80 text-sm font-inter mb-2">
                    Next Step
                  </p>
                  <h3 className="text-2xl font-montserrat font-bold text-primary-foreground mb-2">
                    Schedule Your Service
                  </h3>
                  <p className="text-primary-foreground/70 font-inter text-sm mb-4">
                    Book your next maintenance appointment at your convenience.
                  </p>
                  <div className="inline-block">
                    <Button
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      onClick={handleScheduleService}
                    >
                      Book Now →
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={handleUpgradePlan}
                className="group relative bg-gradient-to-br from-card via-card to-card/50 border border-primary/20 rounded-2xl p-8 text-left hover:border-primary/50 transition-all duration-300"
              >
                <div className="relative z-10">
                  <p className="text-primary text-sm font-inter mb-2">
                    Enhance Your Plan
                  </p>
                  <h3 className="text-2xl font-montserrat font-bold text-foreground mb-2">
                    Upgrade Your Membership
                  </h3>
                  <p className="text-muted-foreground font-inter text-sm mb-4">
                    Get more benefits and enhanced protection for your vehicle.
                  </p>
                  <div className="inline-block">
                    <Button
                      variant="outline"
                      className="border-primary hover:bg-primary/10"
                      onClick={handleUpgradePlan}
                    >
                      Explore Plans →
                    </Button>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </section>

        {/* Member Benefits */}
        <section className="py-20 bg-card/30 border-y border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
                Member Benefits
              </h2>
              <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
                Enjoy exclusive advantages reserved just for our valued members
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {memberBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow-primary transition-all duration-300">
                    <benefit.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-montserrat font-bold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-inter">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
                Your Plan Options
              </h2>
              <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
                Choose the plan that fits your vehicle maintenance needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {membershipTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                    tier.featured
                      ? "bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary shadow-glow-primary"
                      : "bg-card border border-border hover:border-primary/50"
                  }`}
                >
                  {tier.featured && (
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-montserrat font-bold mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-3xl font-montserrat font-bold text-primary mb-6">
                    {tier.price}
                  </div>

                  <ul className="flex-1 space-y-3 mb-6">
                    {tier.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm font-inter"
                      >
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleUpgradePlan}
                    className={`w-full ${
                      tier.featured
                        ? "bg-gradient-primary hover:shadow-glow-primary"
                        : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary"
                    }`}
                  >
                    {tier.featured ? "Current Plan" : "Upgrade to This Plan"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="py-16 bg-card/30 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-montserrat font-bold mb-4">
                Need Assistance?
              </h3>
              <p className="text-muted-foreground mb-6 font-inter">
                Our dedicated support team is here to help with any questions
                about your membership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:980-312-4236">
                  <Button className="bg-gradient-primary hover:shadow-glow-primary">
                    Call Support: 980-312-4236
                  </Button>
                </a>
                <a href="mailto:cornerstonemobile55@gmail.com">
                  <Button variant="outline">
                    Email: cornerstonemobile55@gmail.com
                  </Button>
                </a>
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
