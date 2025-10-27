import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const SpecialOfferPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContactClick = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 w-80 sm:w-96 md:max-w-sm"
        >
          <div className="bg-gradient-to-br from-primary/95 via-secondary/95 to-accent/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-primary/30">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="pr-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-montserrat">
                🎉 Special Offer!
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mb-4 font-inter">
                Get 20% off your first ceramic coating service. Limited time offer!
              </p>
              <Button
                onClick={handleContactClick}
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold transition-all duration-300"
              >
                Claim Offer
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpecialOfferPopup;
