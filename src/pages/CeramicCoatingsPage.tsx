import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CeramicCoatingsPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const disclaimerText = `CERAMIC COATING – WHAT IT DOES & IMPORTANT DISCLAIMERS

WHAT CERAMIC COATINGS ACTUALLY DO
• Create a chemically bonded protective layer that enhances durability
• Provide hydrophobic properties that repel water, dirt, and contaminants
• Protect against UV rays, oxidation, chemicals, bird droppings, bugs, sap, and environmental wear
• Enhance gloss, depth, and shine for a long-lasting "showroom" look
• Make maintenance easier by reducing how often deep cleaning is required
• Offer long-term protection lasting 2–5 years with proper care

WHAT CERAMIC COATINGS DO NOT DO (DISPELLING COMMON MYTHS)
• They are NOT scratch-proof or rock-chip-proof
• They do NOT eliminate the need for washing or regular maintenance
• They do NOT prevent water spotting from minerals or hard water
• They do NOT repair or hide existing scratches or defects—paint correction may be required
• They are NOT permanent; durability depends on maintenance and environment
• They do NOT guarantee results if improperly maintained

IMPORTANT DISCLAIMERS FOR CLIENTS
• Existing scratches, swirls, oxidation, or paint defects will remain visible unless corrected prior to coating
• Ceramic coating longevity varies based on maintenance, vehicle storage, washing habits, and climate
• Hard water, bird droppings, bug remains, and sap can still etch the coating if left untreated
• Professional installation requires extensive prep work, which may increase service costs
• Warranty or lifespan claims require proper aftercare—neglect can void durability expectations
• Coatings reduce—but do not eliminate—the risk of micro-marring during washing

AFTERCARE RESPONSIBILITIES
• Hand wash only using pH-neutral soap
• Avoid automatic car washes and abrasive tools
• Remove contaminants (bird droppings, bug guts, sap) quickly to prevent etching
• Regular maintenance inspections and booster toppers may be recommended every 6–12 months
• Use proper drying techniques to avoid mineral spotting

SUMMARY FOR CLIENT EDUCATION
Ceramic coatings provide industry-leading paint protection, gloss enhancement, and long-term ease of maintenance. However, they require proper preparation, realistic expectations, and consistent aftercare to perform at their highest capability. They are a premium protection solution—not invincibility—designed to preserve your vehicle's beauty and reduce long-term upkeep.`;

  const benefits = [
    {
      title: "UV Protection",
      description: "Protects against oxidation and fading from harmful UV rays",
    },
    {
      title: "Water Beading",
      description: "Water and contaminants bead up and roll off easily",
    },
    {
      title: "Enhanced Gloss",
      description: "Provides a deep, showroom-quality shine and finish",
    },
    {
      title: "Long-Lasting",
      description: "Professional-grade protection lasting 2–5 years",
    },
    {
      title: "Easy Maintenance",
      description: "Reduces need for frequent washing and waxing",
    },
    {
      title: "Environmental Protection",
      description: "Shields against bird droppings, sap, salt, and chemicals",
    },
  ];

  const process = [
    {
      step: 1,
      title: "Paint Assessment",
      description: "We thoroughly inspect your vehicle's paint condition",
    },
    {
      step: 2,
      title: "Paint Correction",
      description: "Remove swirls, scratches, and oxidation if needed",
    },
    {
      step: 3,
      title: "Surface Preparation",
      description: "Deep clean and prep the surface for optimal bonding",
    },
    {
      step: 4,
      title: "Ceramic Application",
      description: "Apply professional-grade ceramic coating with precision",
    },
    {
      step: 5,
      title: "Curing",
      description: "Allow proper curing time for maximum durability",
    },
    {
      step: 6,
      title: "Inspection",
      description: "Final inspection and aftercare instructions provided",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background font-inter pt-32">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-inter"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-6xl font-montserrat font-bold mb-6">
                Professional{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Ceramic Coatings
                </span>
              </h1>
              <p className="text-xl text-muted-foreground font-inter mb-8">
                Discover the ultimate paint protection solution for your vehicle. Our professional ceramic coating service provides long-lasting durability, enhanced gloss, and superior protection against environmental damage.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-24 relative overflow-hidden" ref={ref}>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Hero Image and Description */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="relative h-96 lg:h-full min-h-[500px] rounded-2xl overflow-hidden"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fc70ebb3e5225486399c19406cd27bb43%2F129355e7e5ee45a39a678efa4e782bd5?format=webp&width=800"
                    alt="Ceramic Coating Application"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-4xl font-montserrat font-bold mb-4">
                      What is Ceramic Coating?
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                      Ceramic coating is a liquid polymer that chemically bonds to your vehicle's paint, creating a protective layer that enhances durability and appearance. Unlike traditional wax, ceramic coatings provide longer-lasting protection and superior hydrophobic properties.
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Our professional-grade ceramic coatings are applied by trained specialists using industry-leading techniques to ensure optimal coverage, durability, and results.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={scrollToContact}
                      size="lg"
                      className="bg-gradient-primary hover:shadow-glow-primary"
                    >
                      Book Ceramic Coating
                    </Button>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-primary hover:bg-primary/10"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          View Disclaimer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-montserrat font-bold">
                            Ceramic Coating Disclaimer
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[calc(85vh-120px)] w-full">
                          <div className="space-y-3 text-sm font-inter text-foreground leading-relaxed pr-4 text-justify">
                            {disclaimerText.split('\n\n').map((section, idx) => (
                              <div key={idx}>
                                {section.split('\n').map((line, lineIdx) => (
                                  line.trim() && (
                                    <p key={lineIdx} className="mb-2">
                                      {line}
                                    </p>
                                  )
                                ))}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-20"
            >
              <h2 className="text-4xl font-montserrat font-bold mb-12 text-center">
                Key Benefits
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
                  >
                    <h3 className="text-xl font-montserrat font-bold mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Application Process */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-20"
            >
              <h2 className="text-4xl font-montserrat font-bold mb-12 text-center">
                Our Application Process
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {process.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-8">
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary">
                        <span className="text-primary-foreground font-bold text-lg">
                          {item.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-montserrat font-bold mb-3 mt-4">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-2xl p-12"
            >
              <h2 className="text-4xl font-montserrat font-bold mb-4">
                Ready to Protect Your Vehicle?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Let our professional team apply a premium ceramic coating to your vehicle. Experience the ultimate in paint protection and enhanced appearance.
              </p>
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow-primary"
              >
                Schedule Your Ceramic Coating Today
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Contact Section (anchored for scroll-to) */}
        <section id="contact" className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-montserrat font-bold mb-8 text-center">
              Get Your Quote
            </h2>
            <p className="text-muted-foreground text-center mb-12 text-lg">
              Contact us to schedule your ceramic coating appointment
            </p>
            <div className="max-w-md mx-auto bg-background border border-border rounded-xl p-8">
              <a
                href="tel:980-312-4236"
                className="flex items-center justify-center gap-3 text-lg font-semibold text-primary hover:text-primary/80 transition-colors mb-6"
              >
                <span>📞 980-312-4236</span>
              </a>
              <a
                href="mailto:cornerstonemobile55@gmail.com"
                className="flex items-center justify-center gap-3 text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <span>📧 cornerstonemobile55@gmail.com</span>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default CeramicCoatingsPage;
