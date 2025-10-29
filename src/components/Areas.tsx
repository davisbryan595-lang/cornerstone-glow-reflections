import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Check } from "lucide-react";

const Areas = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedArea, setSelectedArea] = useState<string>("Charlotte");

  const serviceAreas = [
    "Charlotte",
    "Pineville",
    "Fort Mill",
    "Huntersville",
    "Cornelius",
    "Matthews",
    "Mint Hill",
  ];

  const getMapSrc = (area: string) => {
    const q = encodeURIComponent(area + ", NC");
    return `https://maps.google.com/maps?q=${q}&z=12&output=embed`;
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider font-inter">
            Service Areas
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mt-4 mb-6">
            We Come to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Your Location
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-inter">
            Professional mobile detailing service throughout the greater
            Charlotte area
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-primary/30 shadow-glow-primary"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d415740.1283783033!2d-81.13089384999999!3d35.2270869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88541fc4fc381a81%3A0x884650e6bf43d164!2sCharlotte%2C%20NC!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </motion.div>

          {/* Service Areas List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-montserrat font-bold">
                  Charlotte Metro Area
                </h3>
                <p className="text-muted-foreground text-sm font-inter">
                  Full mobile service coverage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {serviceAreas.map((area, index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-inter font-medium">{area}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
              className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 mt-8"
            >
              <h4 className="font-montserrat font-bold text-lg mb-2">
                Not in these areas?
              </h4>
              <p className="text-sm text-muted-foreground mb-4 font-inter">
                We may still be able to help! Contact us to check if we can
                service your location.
              </p>
              <a
                href="tel:980-312-4236"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-glow font-semibold text-sm transition-colors font-inter"
              >
                <MapPin className="w-4 h-4" />
                Call to Inquire: 980-312-4236
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Areas;
