import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Phone, Menu, X, Linkedin, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";


const logoUrl = "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2Fc689032066c740e3a83978925f1d1000?format=webp&width=800";

// Social Media Links
const socialMediaLinks = {
  facebook: "https://www.facebook.com/profile.php?id=61583396480289",
  instagram: "https://www.instagram.com/cornerstonemobile/",
  linkedin: "https://www.linkedin.com/company/cornerstone-mobile-detailing",
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { sessionUser, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };
    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const scrollToSection = (id: string) => {
    // If link has an explicit route path, navigate to it
    const link = navLinks.find((l) => l.id === id && l.path);
    if (link && link.path) {
      navigate(link.path);
      setIsMobileMenuOpen(false);
      return;
    }

    // Fallback: dedicated pages by id
    if (id && (id.toLowerCase() === "pricing" || id.toLowerCase() === "faq")) {
      navigate(`/${id.toLowerCase()}`);
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
    { name: "Maintenance Plans", id: "maintenance-plans", path: "/maintenance-plans" },
    { name: "Membership", id: "membership", path: "/membership" },
    { name: "Gallery", id: "gallery" },
    { name: "Team", id: "team" },
    { name: "Contact", id: "contact" },
    { name: "FAQ", id: "faq" },
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
        {/* Top Bar (hidden when sticky) */}
        {!isScrolled && (
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
                  href={socialMediaLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors hover:scale-110 transform"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={socialMediaLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors hover:scale-110 transform"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={socialMediaLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors hover:scale-110 transform"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <div className={'container mx-auto px-4 ' + (isScrolled ? 'py-2' : 'py-4')}>
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
                <motion.div
                  key={link.id}
                  className={link.id === "pricing" ? "relative group" : ""}
                  onMouseEnter={() => link.id === "pricing" && setIsUserMenuOpen(false)}
                >
                  <motion.button
                    onClick={() => scrollToSection(link.id)}
                    className="px-4 py-2 font-inter font-medium text-sm relative group"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="flex items-center gap-1">
                      {link.name}
                      {link.id === "pricing" && <span className="text-xs">▼</span>}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                  </motion.button>

                  {link.id === "pricing" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                    >
                      <motion.button
                        onClick={() => navigate("/pricing")}
                        className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors text-sm font-inter flex items-center gap-3 group/item"
                        whileHover={{ paddingLeft: 20 }}
                      >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                        <span>Pricing Plans</span>
                      </motion.button>

                      <motion.div className="border-t border-border/30" />

                      <motion.button
                        onClick={() => navigate("/maintenance-plans")}
                        className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors text-sm font-inter flex items-center gap-3 group/item"
                        whileHover={{ paddingLeft: 20 }}
                      >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                        <span>Maintenance Plans</span>
                      </motion.button>

                      <motion.div className="border-t border-border/30" />

                      <motion.button
                        onClick={() => navigate("/membership")}
                        className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors text-sm font-inter flex items-center gap-3 group/item"
                        whileHover={{ paddingLeft: 20 }}
                      >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                        <span>Membership</span>
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons & User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                onClick={() => navigate("/careers")}
                className="bg-secondary hover:shadow-glow-secondary transition-all duration-300"
              >
                Apply for Job
              </Button>

              {loading ? null : sessionUser ? (
                <div className="relative">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 flex items-center justify-center"
                    title={sessionUser.email}
                  >
                    <User className="w-5 h-5 text-primary" />
                  </motion.button>

                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold truncate">{sessionUser.email}</p>
                        <p className="text-xs text-muted-foreground">Logged in</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/subscription-member");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2 text-sm"
                      >
                        <User className="w-4 h-4" />
                        My Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2 text-sm"
                      >
                        <User className="w-4 h-4" />
                        Admin Panel
                      </button>
                      <button
                        onClick={async () => {
                          await signOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-600 transition-colors flex items-center gap-2 text-sm border-t border-border"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/auth")}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 transition-all duration-300"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                  >
                    Get Free Quote
                  </Button>
                </>
              )}
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

          {sessionUser && (
            <div className="mb-6 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold truncate">{sessionUser.email}</p>
              <p className="text-xs text-muted-foreground">Logged in</p>
            </div>
          )}

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
                href={socialMediaLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={socialMediaLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={socialMediaLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {sessionUser ? (
            <>
              <Button
                onClick={() => {
                  navigate("/subscription-member");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-primary/10 text-primary border border-primary/30 mb-2"
              >
                My Dashboard
              </Button>
              <Button
                onClick={async () => {
                  await signOut();
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-red-500/30 text-red-600 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  navigate("/auth");
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10 mb-2"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  scrollToSection("contact");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-primary"
              >
                Get Free Quote
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
