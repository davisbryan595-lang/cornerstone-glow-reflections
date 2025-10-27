import { useEffect, useState } from "react";
import { motion } from "framer-motion";
const logoUrl = "https://cdn.builder.io/api/v1/image/assets%2Fbbaa1bd46cba4346a5396fea34722449%2F7f7af8c302a84370a13259ea2343e9d6?format=webp&width=800";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 1.5,
          }}
          className="relative"
        >
          <motion.img
            src={logoUrl}
            alt="Cornerstone Mobile Detailing"
            className="w-32 h-32 md:w-40 md:h-40"
            animate={{
              filter: [
                "drop-shadow(0 0 20px hsl(182 85% 40% / 0.6))",
                "drop-shadow(0 0 40px hsl(85 100% 55% / 0.6))",
                "drop-shadow(0 0 20px hsl(182 85% 40% / 0.6))",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cornerstone Mobile Detailing
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-inter">
            The Foundation Has Been Set
          </p>
        </motion.div>

        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
