import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const packages = [
  {
    name: "Basic Package",
    subtitle: "Essential Clean & Refresh",
    prices: { compact: 79, sedan: 99, suv: 119 },
    features: ["Exterior hand wash", "Tire & wheel clean", "Interior vacuum", "Window clean"],
  },
  {
    name: "Premium Package",
    subtitle: "Enhanced Protection & Gloss",
    prices: { compact: 149, sedan: 179, suv: 209 },
    features: [
      "Everything in Basic",
      "Multi-stage polish",
      "Paint sealant application",
      "Interior deep clean",
    ],
  },
  {
    name: "Royal Finish",
    subtitle: "Long-Term Protection & Showroom Shine",
    prices: { compact: 399, sedan: 499, suv: 599 },
    features: [
      "Everything in Premium",
      "Full paint correction (as needed)",
      "Ceramic coating application",
      "Wheel & trim protection",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background font-inter">

      <main className="container mx-auto px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold mt-4 mb-4">Choose Your Package</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Clear, simple pricing for every vehicle. Select a package based on the protection and finish you want.</p>
        </motion.div>

        {/* Header nav for quick links */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { name: 'Home', id: 'hero' },
            { name: 'About', id: 'about' },
            { name: 'Services', id: 'services' },
            { name: 'Pricing', id: 'pricing' },
            { name: 'Gallery', id: 'gallery' },
            { name: 'Team', id: 'team' },
            { name: 'Contact', id: 'contact' },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.id === 'pricing') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  window.location.href = `/#${link.id}`;
                }
              }}
              className="px-4 py-2 text-sm rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
              <div className="flex-1">
                <h3 className="text-2xl font-montserrat font-bold mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.subtitle}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Starting at</h4>
                  <div className="flex items-end gap-4">
                    <div>
                      <div className="text-xl font-montserrat font-bold">Compact</div>
                      <div className="text-2xl font-montserrat font-bold text-primary">${pkg.prices.compact}</div>
                    </div>
                    <div>
                      <div className="text-xl font-montserrat font-bold">Sedan</div>
                      <div className="text-2xl font-montserrat font-bold text-primary">${pkg.prices.sedan}</div>
                    </div>
                    <div>
                      <div className="text-xl font-montserrat font-bold">SUV / Truck</div>
                      <div className="text-2xl font-montserrat font-bold text-primary">${pkg.prices.suv}</div>
                    </div>
                  </div>
                </div>

                <ul className="mb-6 space-y-2">
                  {pkg.features.map((f) => (
                    <li key={f} className="text-sm flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a href="/#contact">
                  <Button className="w-full bg-gradient-primary">Book {pkg.name.split(" ")[0]}</Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-xl font-montserrat font-bold mb-4">Custom Quotes & Fleet Pricing</h3>
          <p className="text-muted-foreground mb-4">Have a fleet, dealership, or special project? We offer custom packages and volume discounts. Contact us for a tailored quote.</p>
          <a href="mailto:cornerstonemobile55@gmail.com" className="inline-block">
            <Button variant="outline">Request Custom Quote</Button>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
