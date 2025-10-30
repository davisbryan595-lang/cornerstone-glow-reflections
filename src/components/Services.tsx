import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Shield, Droplets, Sun, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const services = [
    {
      icon: Sparkles,
      title: "Paint Correction",
      description:
        "Restore your vehicle's finish to perfection. We remove swirl marks, scratches, and oxidation using multi-stage polishing.",
      features: [
        "Swirl mark removal",
        "Scratch correction",
        "Oxidation removal",
        "Clear coat restoration",
      ],
      image: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F217d4eb50bee42859e2dd4a8c8a93878?format=webp&width=800",
    },
    {
      icon: Shield,
      title: "Ceramic Coating",
      description:
        "Long-lasting protection with a stunning gloss finish. Our ceramic coatings provide years of protection against the elements.",
      features: [
        "9H hardness protection",
        "Hydrophobic properties",
        "UV ray protection",
        "5-year warranty",
      ],
      image: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F51b4b63cf38f4b6f9c834acd63754fb6?format=webp&width=800",
    },
    {
      icon: Droplets,
      title: "Auto Detailing",
      description:
        "Complete interior and exterior cleaning. From deep carpet shampooing to engine bay detailing, we cover it all.",
      features: [
        "Interior deep clean",
        "Exterior wash & wax",
        "Engine bay cleaning",
        "Leather conditioning",
      ],
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop",
    },
    {
      icon: Sun,
      title: "Headlight & Trim Restoration",
      description:
        "Restore clarity to headlights and revive faded trim for improved safety and appearance.",
      features: [
        "UV-resistant protection",
        "Oxidation removal",
        "Trim color restoration",
        "Improved night visibility",
      ],
      image: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2Fa5e6242bc19b4da6b4315121b0677b2c?format=webp&width=800",
    },
  ];

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/50" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider font-inter">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mt-4 mb-6">
            Premium Auto Care{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-inter">
            Professional services tailored to your vehicle's needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Alert className="border-primary bg-primary/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-montserrat font-semibold">Please Note</AlertTitle>
            <AlertDescription className="font-inter">
              <p className="font-semibold text-foreground">Need water source 50 ft to vehicle to wash exterior.</p>
              <p className="font-semibold text-foreground">Interior can be taken care of anywhere.</p>
            </AlertDescription>
          </Alert>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80" />
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-montserrat font-bold">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm font-inter"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={scrollToContact}
                  variant="outline"
                  className="w-full mt-4 border-primary hover:bg-primary/10 group-hover:shadow-glow-primary transition-all duration-300"
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-card via-primary/5 to-card border border-primary/20 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-montserrat font-bold mb-4">
            Need a Custom Package?
          </h3>
          <p className="text-muted-foreground mb-6 font-inter">
            We offer customized detailing packages for fleets, dealerships, and
            special projects. Contact us for a personalized quote.
          </p>
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-gradient-primary hover:shadow-glow-primary"
          >
            Request Custom Quote
          </Button>
        </motion.div>
      </div>

      {/* Decorative Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-20 fill-current text-background"
        >
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
        </svg>
      </div>
    </section>
  );
};

export default Services;
