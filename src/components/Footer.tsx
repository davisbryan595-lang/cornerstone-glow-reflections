import { Facebook, Instagram, Mail, Phone } from "lucide-react";
const logoUrl = "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2Fc689032066c740e3a83978925f1d1000?format=webp&width=800";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-primary/5 opacity-50" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Cornerstone Mobile Detailing"
                className="w-20 h-20"
              />
              <span className="font-montserrat font-bold text-lg">
                Cornerstone
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-inter leading-relaxed">
              The Foundation is Family for premium mobile auto detailing in
              Charlotte, NC.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:border-primary hover:shadow-glow-primary transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:border-accent hover:shadow-glow-accent transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-montserrat font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About", "Services", "Pricing", "Gallery", "Team", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(link.toLowerCase())}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-inter"
                    >
                      {link}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-montserrat font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-inter">
              <li>Paint Correction</li>
              <li>Ceramic Coating</li>
              <li>Auto Detailing</li>
              <li>Headlight & Trim Restoration</li>
              <li>Interior Cleaning</li>
              <li>Exterior Wash</li>
              <li>Engine Bay Cleaning</li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-montserrat font-bold mb-4">Service Areas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-inter">
              <li>Charlotte</li>
              <li>Pineville</li>
              <li>Fort Mill</li>
              <li>Huntersville</li>
              <li>Cornelius</li>
              <li>Matthews</li>
              <li>Mint Hill</li>
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center text-sm">
            <a
              href="tel:980-312-4236"
              className="flex items-center gap-2 hover:text-primary transition-colors font-inter"
            >
              <Phone className="w-4 h-4" />
              980-312-4236
            </a>
            <a
              href="mailto:cornerstonemobile55@gmail.com"
              className="flex items-center gap-2 hover:text-primary transition-colors font-inter"
            >
              <Mail className="w-4 h-4" />
              cornerstonemobile55@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground font-inter">
          <p>
            © {currentYear} Cornerstone Mobile Detailing LLC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
