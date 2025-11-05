import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Award, Zap, Heart, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Membership = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Zap,
      title: "Exclusive Pricing",
      description:
        "Locked-in discounted rates on all services during your membership.",
    },
    {
      icon: Award,
      title: "Priority Scheduling",
      description:
        "Preferred booking windows to fit your schedule, first come — first served.",
    },
    {
      icon: Shield,
      title: "Ongoing Protection",
      description:
        "Paint and interior protection that keeps your vehicle looking pristine.",
    },
    {
      icon: Heart,
      title: "Premium Care",
      description:
        "Every visit includes premium products and extra attention to detail.",
    },
  ];

  const tiers = [
    {
      name: "Maintenance - Basic",
      price: "$149.99/mo",
      highlights: [
        "Monthly maintenance detail",
        "Interior refresh + exterior wash",
        "Premium tire & trim dressing",
        "10% off add-ons",
      ],
    },
    {
      name: "Maintenance - Premium",
      price: "$199.99/mo",
      highlights: [
        "Bi-monthly full detail",
        "Deep interior + exterior cleaning",
        "Extended paint protection",
        "15% off add-ons",
        "Priority booking",
      ],
      featured: true,
    },
    {
      name: "Maintenance - Elite",
      price: "$249.99/mo",
      highlights: [
        "Quarterly comprehensive detail",
        "Paint correction service",
        "Ceramic protection",
        "20% off add-ons",
        "Concierge support",
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" style={{ marginTop: 100 }}>
        {/* Hero */}
        <section className="py-20 relative overflow-hidden pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
                Membership <span className="bg-gradient-primary bg-clip-text text-transparent">Programs</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Consistency builds excellence — choose a plan that keeps your vehicle in peak condition.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Button className="bg-gradient-primary hover:shadow-glow-primary" onClick={() => navigate("/subscription")}>Get Started</Button>
                <Button variant="outline" onClick={() => navigate("/subscription-member")}>Member Dashboard</Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-card/30 border-y border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
              ref={ref}
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">Why Become a Member?</h2>
              <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
                Enjoy predictable maintenance, better protection, and exclusive perks that save time and money.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {benefits.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow-primary transition-all duration-300">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-montserrat font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-inter">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
                Three flexible options designed for every season of ownership.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
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

                  <h3 className="text-2xl font-montserrat font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-montserrat font-bold text-primary mb-6">{tier.price}</div>

                  <ul className="flex-1 space-y-3 mb-6">
                    {tier.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm font-inter">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`${tier.featured ? "bg-gradient-primary hover:shadow-glow-primary" : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary"}`}
                    onClick={() => navigate("/subscription")}
                  >
                    Get Started
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-card/30 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-montserrat font-bold mb-4">Ready to join?</h3>
              <p className="text-muted-foreground mb-6 font-inter">Start your membership today and keep your vehicle at its best, year-round.</p>
              <Button className="bg-gradient-primary hover:shadow-glow-primary" onClick={() => navigate("/subscription")}>
                Choose a Plan
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Membership;
