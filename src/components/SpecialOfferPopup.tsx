import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Crown, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const SpecialOfferPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showViewButton, setShowViewButton] = useState(false);
  const navigate = useNavigate();
  const { isMember } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show the view offer button after popup is closed
    if (!isVisible && showViewButton === false) {
      const timer = setTimeout(() => {
        setShowViewButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, showViewButton]);

  const handleJoinMembership = () => {
    navigate("/pricing");
    setIsVisible(false);
  };

  // Don't show popup if user is already a member
  const shouldShowPopup = !isMember;

  return (
    <>
      <AnimatePresence>
        {isVisible && shouldShowPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 w-80 sm:w-96 md:max-w-sm"
          >
            <div className="bg-gradient-to-br from-primary/95 via-accent/90 to-secondary/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-primary/40">
              <button
                onClick={() => {
                  setIsVisible(false);
                  setShowViewButton(true);
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white font-montserrat">
                    Unlock Exclusive Membership
                  </h3>
                </div>
                <p className="text-xs sm:text-xs md:text-sm text-white/90 mb-3 font-inter">
                  Members get:
                </p>
                <ul className="text-xs text-white/85 mb-4 space-y-1.5 font-inter">
                  <li className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Up to 30% off maintenance plans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Priority scheduling & booking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Exclusive member-only discounts</span>
                  </li>
                </ul>
                <Button
                  onClick={handleJoinMembership}
                  className="w-full bg-white text-primary hover:bg-white/90 font-semibold transition-all duration-300"
                >
                  Join Membership
                </Button>
                <p className="text-xs text-white/70 mt-3 text-center font-inter">
                  Limited spots available this month!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Offer Button */}
      <AnimatePresence>
        {showViewButton && !isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setIsVisible(true);
              setShowViewButton(false);
            }}
            className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-primary rounded-full shadow-lg border border-primary/30 flex items-center justify-center hover:shadow-glow-primary transition-all duration-300 group"
          >
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpecialOfferPopup;
