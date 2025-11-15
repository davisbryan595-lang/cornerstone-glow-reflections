import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Award, Zap, Heart, Shield, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthProvider";

const Membership = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sessionUser, isMember } = useAuth();

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
      price: "$50/mo",
      highlights: [
        "Monthly maintenance detail",
        "Interior refresh + exterior wash",
        "Premium tire & trim dressing",
        "10% off add-ons",
      ],
    },
    {
      name: "Maintenance - Premium",
      price: "$50/mo",
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
      price: "$50/mo",
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


        {/* Membership Dashboard Preview (status-only) */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-montserrat font-bold mb-2">Membership Status</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">This preview shows only the current membership status, payment status, and upgrade suggestions.</p>
            </motion.div>

            <div className="max-w-4xl mx-auto grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h4 className="font-montserrat font-bold text-lg mb-4">Current Membership</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Plan</p>
                    <p className="font-semibold">Maintenance - Premium</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-semibold text-emerald-500">Active</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <p className="font-semibold">Paid</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">Billing Structure</p>
                  <p className="font-medium">Monthly • Next billing: 2025-01-15</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h4 className="font-montserrat font-bold text-lg mb-4">Upgrade Suggestions</h4>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">Add Ceramic Touch-up</p>
                      <p className="text-sm text-muted-foreground">Improve paint protection between full services.</p>
                    </div>
                    <Button className="bg-primary/10 text-primary border border-primary" onClick={() => navigate('/subscription')}>Add</Button>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">Upgrade to Elite</p>
                      <p className="text-sm text-muted-foreground">Quarterly comprehensive care & concierge support.</p>
                    </div>
                    <Button className="bg-gradient-primary" onClick={() => navigate('/subscription')}>Upgrade</Button>
                  </li>
                </ul>

                <div className="border-t border-border pt-4">
                  <h5 className="font-semibold mb-2">Send us a suggestion</h5>
                  <form id="member-suggestion-form" className="space-y-3" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const name = (fd.get('name') as string) || 'Anonymous'; const email = (fd.get('email') as string) || ''; const message = (fd.get('message') as string) || ''; if(!message || message.trim().length < 5){ toast({ title: 'Message too short', description: 'Please enter a longer message.' }); return; } /* send suggestion - placeholder */ toast({ title: 'Thanks!', description: 'Your suggestion was sent. We appreciate your feedback.' }); (e.currentTarget as HTMLFormElement).reset(); }}>
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

        {/* Testimonials */}
        <section className="py-20 bg-background/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="text-3xl font-montserrat font-bold mb-2">What Members Say</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">Real members, real results—why our members stick with us.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { quote: "My car never looked better. Membership made maintenance effortless.", author: "— Sarah L." },
                { quote: "Priority scheduling is a game changer. I always get the time I want.", author: "— Marcus T." },
                { quote: "Great value and excellent attention to detail. Highly recommend.", author: "— Priya R." },
              ].map((t, i) => (
                <motion.blockquote
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-6 text-sm"
                >
                  <p className="mb-4 text-muted-foreground">"{t.quote}"</p>
                  <cite className="text-xs font-semibold">{t.author}</cite>
                </motion.blockquote>
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

        {/* Benefits (moved to bottom) */}
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
      </main>
      <Footer />
    </>
  );
};

export default Membership;
