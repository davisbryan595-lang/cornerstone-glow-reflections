import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Phone, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const logoUrl = "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2Fc689032066c740e3a83978925f1d1000?format=webp&width=800";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // If pricing, navigate to pricing page
    if (id === "pricing") {
      // Use full navigation so it works from any page
      window.location.href = "/pricing";
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
      return;
    }

    // If section not found on this page, navigate to homepage anchor
    window.location.href = `/#${id}`;
  };

  const navLinks = [
    { name: "Home", id: "hero" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Pricing", id: "pricing" },
    { name: "Gallery", id: "gallery" },
    { name: "Team", id: "team" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl shadow-lg border-b border-primary/20"
            : "bg-background/30 backdrop-blur-md border-b border-primary/10"
        }`}
      >
        {/* Top Bar */}
        <div className="border-b border-border/50 py-2 hidden lg:block">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a
                href="mailto:cornerstonemobile55@gmail.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>cornerstonemobile55@gmail.com</span>
              </a>
              <a
                href="tel:980-312-4236"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>980-312-4236</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors hover:scale-110 transform"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors hover:scale-110 transform"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-lg group-hover:from-primary/50 group-hover:to-accent/50 transition-all duration-300" />
                <img
                  src={logoUrl}
                  alt="Cornerstone Mobile Detailing"
                  className="w-28 h-28 drop-shadow-[0_0_20px_rgba(23,200,200,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(23,200,200,1)] transition-all duration-300 relative z-10"
                />
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-2 font-inter font-medium text-sm relative group"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                onClick={() => navigate("/careers")}
                className="bg-secondary hover:shadow-glow-secondary transition-all duration-300"
              >
                Apply for Job
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
              >
                Get Free Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : "100%",
        }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-card z-50 lg:hidden shadow-2xl border-l border-primary/20"
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <img src={logoUrl} alt="Logo" className="w-24 h-24" />
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <Button
            onClick={() => {
              navigate("/careers");
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-secondary mb-6"
          >
            Apply for Job
          </Button>

          <div className="flex flex-col gap-4 flex-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors font-inter"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="space-y-4 mt-8 border-t border-border pt-6">
            <a
              href="tel:980-312-4236"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              980-312-4236
            </a>
            <a
              href="mailto:cornerstonemobile55@gmail.com"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              cornerstonemobile55@gmail.com
            </a>
            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <Button
            onClick={() => scrollToSection("contact")}
            className="w-full bg-gradient-primary mt-4"
          >
            Get Free Quote
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
