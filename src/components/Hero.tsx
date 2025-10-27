import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animated counter hook
  const useCounter = (target: number, duration: number = 2) => {
    const count = useMotionValue(0);
    
    useEffect(() => {
      const controls = animate(count, target, {
        duration,
        onComplete: () => {
          setTimeout(() => {
            animate(count, 0, { duration: 0.5 });
            setTimeout(() => {
              animate(count, target, { duration });
            }, 500);
          }, 2000);
        },
      });
      return controls.stop;
    }, [target, duration, count]);
    
    return useTransform(count, (latest) => Math.round(latest));
  };

  const yearsCount = useCounter(5);
  const carsCount = useCounter(1000);
  const clientsCount = useCounter(500);
  const areasCount = useCounter(7);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source
            src="https://cdn.pixabay.com/video/2022/12/15/143467-782015997_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-card/90" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 inline-block"
          >
            <div className="relative p-4 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow-glow-primary animate-glow">
              <img
                src={logo}
                alt="Cornerstone Mobile Detailing"
                className="w-24 h-24 drop-shadow-[0_0_25px_rgba(23,200,200,0.8)] animate-float"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-6 inline-block"
          >
            <span className="px-6 py-2 bg-gradient-primary rounded-full text-sm font-semibold font-inter shadow-glow-primary">
              Charlotte's Premier Mobile Detailing
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-montserrat font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-float">
              The Foundation
            </span>
            <br />
            <span className="text-foreground">Has Been Set</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 font-inter max-w-3xl mx-auto leading-relaxed"
          >
            Professional paint correction, ceramic coating & auto detailing
            services that bring showroom shine directly to your location.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-primary hover:shadow-glow-primary text-lg px-8 py-6 transition-all duration-300"
            >
              Get a Free Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("services")}
              className="border-2 border-primary hover:bg-primary/10 text-lg px-8 py-6 transition-all duration-300"
            >
              Explore Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold font-montserrat bg-gradient-primary bg-clip-text text-transparent">
                <motion.span>{yearsCount}</motion.span>+
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-inter">
                Years Experience
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold font-montserrat bg-gradient-primary bg-clip-text text-transparent">
                <motion.span>{carsCount}</motion.span>+
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-inter">
                Cars Detailed
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold font-montserrat bg-gradient-primary bg-clip-text text-transparent">
                <motion.span>{clientsCount}</motion.span>+
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-inter">
                Happy Clients
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold font-montserrat bg-gradient-primary bg-clip-text text-transparent">
                <motion.span>{areasCount}</motion.span>+
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-inter">
                Service Areas
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
};

export default Hero;
