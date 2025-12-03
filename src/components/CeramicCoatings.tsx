import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

const CeramicCoatings = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <section
      id="ceramic-coatings"
      className="py-24 relative overflow-hidden"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
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

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider font-inter">
                  Premium Protection
                </span>
                <h2 className="text-4xl md:text-5xl font-montserrat font-bold mt-4 mb-4">
                  Ceramic{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Coatings
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg font-inter leading-relaxed">
                  Protect and enhance your vehicle's paint with our professional
                  ceramic coating application. Our coatings create a chemically
                  bonded protective layer that provides long-lasting durability
                  against environmental damage.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-montserrat font-semibold">
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {[
                    "UV protection against oxidation and fading",
                    "Water beading and repellency for easy maintenance",
                    "Enhanced gloss and depth for a showroom finish",
                    "Long-lasting protection for 2–5 years",
                    "Reduced need for regular washing and waxing",
                    "Protection against bird droppings, sap, and contaminants",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="font-inter text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
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
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Ceramic Coating Disclaimer
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-full w-full pr-4">
                      <div className="space-y-4 text-sm font-inter text-foreground whitespace-pre-wrap">
                        {disclaimerText}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-card border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-inter text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Professional Installation:
                  </span>{" "}
                  Our ceramic coating service includes thorough paint preparation,
                  professional application, and complete coverage for optimal
                  results and maximum longevity.
                </p>
              </div>
            </motion.div>
          </div>
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

export default CeramicCoatings;
