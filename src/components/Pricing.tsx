import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "./ui/button";

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const plans = [
    {
      name: "Interior Detail",
      price: "$217.99",
      coupePrice: 217.99,
      truckPrice: 237.99,
      description: "Thorough interior detailing service",
      features: [
        "Detailed Vacuum of Floors, Carpets, and Trunk",
        "Detailed Wipe Down of All Interior Plastics",
        "Plastics Cleaned (dash, door panels, etc)",
        "Floor Mats Cleaned",
        "Leather Conditioned",
        "Windows Cleaned to Streak-Free Finish",
        "Door Jambs Cleaned",
        "Trunk Cleaned",
      ],
      popular: false,
      offerText: null,
    },
    {
      name: "Exterior Detail",
      price: "$144.99",
      coupePrice: 144.99,
      truckPrice: 184.88,
      description: "Premium exterior detail with protection",
      features: [
        "Professional Hand Wash + Foam Bath",
        "Bug Splatters Cleaned Off",
        "Clay Bar Treatment",
        "Micro Contaminants Removed from Paint",
        "Exterior Windows Cleaned",
        "Wheels + Rims Deep Cleaned",
        "Ceramic Paint Sealant Applied",
        "Protection: 6 Month Paint Sealant",
      ],
      popular: false,
      offerText: null,
    },
    {
      name: "Full Detail",
      price: "$304.99",
      coupePrice: 304.99,
      truckPrice: 324.99,
      description: "Complete interior & exterior detail",
      features: [
        "Detailed Vacuum",
        "Detailed Wipe Down",
        "Clean & Protect Plastic",
        "Floor Mats Cleaned",
        "Leather Conditioned",
        "Windows & Mirrors Cleaned",
        "Door Jambs Cleaned",
        "Protection: 3 Month Paint Sealant",
      ],
      popular: false,
      offerText: null,
    },
    {
      name: "The Best In Class",
      price: "$419.99",
      coupePrice: 419.99,
      truckPrice: 449.99,
      description: "Premium package with enhanced treatments",
      features: [
        "Every crack & Crevice Detailed",
        "Engine Bay Cleaning",
        "O-zone Treatment",
        "6 Month Paint Sealant",
        "Stain Removal",
        "Professional Hand Wash + Foam Bath",
        "Wheels + Rims Deep Cleaned",
        "Tires Shined + Dressed",
      ],
      popular: true,
      offerText: "Get 10% off your next maintenance wash",
    },
  ];

  const scrollToContact = () => {
    const element = document.getElementById("contact-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider font-inter">
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mt-4 mb-6">
            Choose Your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Perfect Package
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-inter">
            Transparent pricing with no hidden fees. All packages include mobile
            service to your location.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-card border rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? "border-2 border-primary shadow-glow-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="p-8">
                {/* Header */}
                <h3 className="text-2xl font-montserrat font-bold mb-2">
                  {plan.name}
                </h3>
                {plan.offerText && (
                  <p className="text-primary text-sm font-semibold mb-3 font-inter">
                    {plan.offerText}
                  </p>
                )}
                <p className="text-muted-foreground text-sm mb-6 font-inter">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-montserrat font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground font-inter">
                      / service
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm font-inter">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={scrollToContact}
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-primary hover:shadow-glow-primary"
                      : "bg-primary/10 hover:bg-primary/20 text-foreground border border-primary/30"
                  }`}
                  size="lg"
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-12 font-inter"
        >
          * Prices may vary based on vehicle size and condition. Multi-vehicle
          and fleet discounts available.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
