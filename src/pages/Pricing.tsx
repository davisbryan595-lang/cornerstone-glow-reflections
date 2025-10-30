import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BackToTopButton from "@/components/BackToTopButton";

const detailingServices = [
  {
    name: "Interior Detail",
    coupeSedan: 217.99,
    truckSuv: 237.99,
    description: "This our thorough interior detailing service. Once done, your car's interior will invite you with a fresh look, smell, & feel for a peaceful driving experience!",
    services: [
      "Detailed Vacuum of Floors, Carpets, and Trunk",
      "Detailed Wipe Down of All Interior Plastics",
      "Plastics Cleaned (dash, door panels, etc)",
      "All Cracks + Crevices",
      "Floor Mats Cleaned",
      "Leather Conditioned",
      "Windows Cleaned to Streak-Free Finish",
      "Door Jambs Cleaned",
      "Trunk Cleaned",
      "Air Freshener (if requested)",
    ],
  },
  {
    name: "Full Detail",
    coupeSedan: 304.99,
    truckSuv: 324.99,
    description: "This is our full interior & exterior detail designed to clean every inch of your car!",
    services: [
      "INTERIOR (detailed cleaning)",
      "Detailed Vacuum",
      "Detailed Wipe Down",
      "All Cracks + Crevices",
      "Clean & Protect Plastic",
      "Floor Mats Cleaned",
      "Leather Conditioned",
      "Windows & Mirrors Cleaned",
      "Door Jambs Cleaned",
      "Trunk Cleaned",
      "Air Freshener (if requested)",
      "EXTERIOR (detailed wash)",
      "Professional Hand Wash + Foam Bath",
      "Bug Splatters Cleaned Off",
      "Wheels + Rims Deep Cleaned",
      "Tires Shined + Dressed",
      "Clean Door Jambs",
      "Protection: 3 Month Paint Sealant (protects + shines)",
    ],
  },
  {
    name: "Exterior Detail",
    coupeSedan: 144.99,
    truckSuv: 184.88,
    description: "This premium exterior detail is designed to remove micro contaminants from your cars paint, leave a silky smooth finish, and protect the paint for up to 8 months!",
    services: [
      "EXTERIOR (detailed wash, prep & protection)",
      "Professional Hand Wash + Foam Bath",
      "Bug Splatters Cleaned Off",
      "Clay Bar Treatment",
      "Micro Contaminants Removed from Paint",
      "Exterior Windows Cleaned",
      "Wheels + Rims Deep Cleaned",
      "Plastic Trim Dressed & Shined",
      "Ceramic Paint Sealant Applied",
      "Protection: 6 Month Paint Sealant (protects + shines)",
      "Premium Tire Dressing (more durable)",
      "Plastic Trim Coated & Dressed (UV protectant + deep black finish)",
    ],
  },
];

const paintCorrectionServices = [
  {
    name: "1 Step Paint Correction & Polish",
    coupePrice: 399,
    truckSedan: 549.99,
    description: "Reveal a flawless, mirror-like shine by removing light swirls and surface imperfections with a precision single-stage polish. Aiming to correct between 60-70% of fine scratches and swirl marks for an enhanced finish.",
    services: [
      "EXTERIOR WASH PROCESS:",
      "Professional Hand Wash + Foam Bath",
      "Bug Splatters Cleaned Off",
      "Wheels + Rims Deep Cleaned",
      "Clay Bar Service to Prep Paint",
      "Micro Contaminants Removed from Paint",
      "1 STEP POLISH PROCESS:",
      "Comprehensive Inspection to Identify Paint Defects",
      "Professional Selection of Right Polish + Pads for Your Car",
      "Single Stage Paint Enhancement & Buff",
      "Isopropyl Alcohol Wipe Down (removes polish residue)",
      "Protection: 6 Month Paint Sealant (protects + shines)",
      "Premium Tire Dressing (more durable)",
      "Plastic Trim Coated & Dressed (UV protectant + deep black finish)",
    ],
  },
  {
    name: "2 Step Paint Correction & Polish",
    coupePrice: 694.99,
    truckSedan: 749.99,
    description: "Reveal a flawless, mirror-like shine by removing light swirls and surface imperfections with a precision single-stage polish. Aiming to correct between 70-80% of fine scratches and swirl marks for a nearly perfect finish.",
    services: [
      "EXTERIOR WASH PROCESS:",
      "Professional Hand Wash + Foam Bath",
      "Bug Splatters Cleaned Off",
      "Wheels + Rims Deep Cleaned",
      "Clay Bar Service to Prep Paint",
      "Micro Contaminants Removed from Paint",
      "2 STEP POLISH PROCESS:",
      "Comprehensive Inspection to Identify Paint Defects",
      "Professional Selection of Right Polish + Pads for Your Car",
      "Professional Cut to Remove Paint Imperfections",
      "Paint Enhancement & Buff to Restore Gloss & Brilliance",
      "Isopropyl Alcohol Wipe Down (removes polish residue)",
      "Protection: 6 Month Paint Sealant (protects + shines)",
      "Premium Tire Dressing (more durable)",
      "Plastic Trim Coated & Dressed (UV protectant + deep black finish)",
    ],
  },
  {
    name: "3 Step Paint Correction & Polish",
    coupePrice: 894.99,
    truckSedan: 949.99,
    description: "Completely transform your car's paintwork, restoring a near perfect, show-room quality finish with our 3 stage paint correction- aiming to correct 95% of impurities.",
    services: [
      "EXTERIOR WASH PROCESS:",
      "Professional Hand Wash + Foam Bath",
      "Bug Splatters Cleaned Off",
      "Wheels + Rims Deep Cleaned",
      "Clay Bar Service to Prep Paint",
      "Micro Contaminants Removed from Paint",
      "3 STEP POLISH PROCESS:",
      "Comprehensive Inspection to Identify Paint Defects",
      "Professional Selection of Right Polish + Pads for Your Car",
      "Wet Sand of Deep Imperfections",
      "Professional Cut to Remove Paint Imperfections & Marring",
      "Paint Enhancement & Buff to Restore Gloss & Brilliance",
      "Isopropyl Alcohol Wipe Down (removes polish residue)",
      "Protection: 6 Month Paint Sealant (protects + shines)",
      "Premium Tire Dressing (more durable)",
      "Plastic Trim Coated & Dressed (UV protectant + deep black finish)",
    ],
  },
];

const Pricing = () => {
  const [vehicleType, setVehicleType] = useState("coupe");

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <main className="container mx-auto px-4 py-24 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-block text-primary font-semibold text-sm uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-full"
          >
            Pricing Plans
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mt-6 mb-6"
          >
            Premium Detailing{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Services
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter"
          >
            Clear, transparent pricing for every service. Choose the package that fits your vehicle and needs.
          </motion.p>
        </motion.div>

        {/* Detailing Services Section */}
        <section className="mb-20 w-full">
          <div className="flex justify-center mb-12">
            <Tabs
              value={vehicleType}
              onValueChange={setVehicleType}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="coupe">Coupe/Sedan</TabsTrigger>
                <TabsTrigger value="truck">Truck/SUV</TabsTrigger>
              </TabsList>

              <TabsContent value="coupe" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {detailingServices.map((service, idx) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <h3 className="text-2xl font-montserrat font-bold mb-2 text-primary">
                          {service.name}
                        </h3>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-3 font-inter">
                            {service.description}
                          </p>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Coupe/Sedan Price
                            </p>
                            <p className="text-3xl font-montserrat font-bold text-primary">
                              ${service.coupeSedan}
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold mb-3 font-inter">
                            Services Included:
                          </h4>
                          <ul className="space-y-2">
                            {service.services.map((svc, i) => (
                              <li
                                key={i}
                                className="text-xs text-muted-foreground flex items-start gap-2 font-inter"
                              >
                                <span className="text-primary font-bold mt-1">✓</span>
                                <span>{svc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <a href="/#contact">
                        <Button className="w-full bg-gradient-primary hover:shadow-glow-primary">
                          Get Quote Now
                        </Button>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="truck" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {detailingServices.map((service, idx) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <h3 className="text-2xl font-montserrat font-bold mb-2 text-primary">
                          {service.name}
                        </h3>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-3 font-inter">
                            {service.description}
                          </p>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Truck/SUV Price
                            </p>
                            <p className="text-3xl font-montserrat font-bold text-primary">
                              ${service.truckSuv}
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold mb-3 font-inter">
                            Services Included:
                          </h4>
                          <ul className="space-y-2">
                            {service.services.map((svc, i) => (
                              <li
                                key={i}
                                className="text-xs text-muted-foreground flex items-start gap-2 font-inter"
                              >
                                <span className="text-primary font-bold mt-1">✓</span>
                                <span>{svc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <a href="/#contact">
                        <Button className="w-full bg-gradient-primary hover:shadow-glow-primary">
                          Get Quote Now
                        </Button>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Paint Correction Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-montserrat font-bold mb-12 text-center">
            Paint Correction & Polish
          </h2>
          <div className="space-y-8">
            {paintCorrectionServices.map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coupe/Sedan */}
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
                    <h3 className="text-xl font-montserrat font-bold mb-2 text-primary">
                      {service.name}
                    </h3>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Coupe Sedan: ${service.coupePrice}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-inter">
                      {service.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-3 font-inter">
                        Service Includes:
                      </h4>
                      <ul className="space-y-2">
                        {service.services.map((svc, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-2 font-inter"
                          >
                            <span className="text-primary font-bold mt-1">✓</span>
                            <span>{svc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a href="/#contact">
                      <Button className="w-full bg-gradient-primary hover:shadow-glow-primary">
                        Get Quote Now
                      </Button>
                    </a>
                  </div>

                  {/* Truck/Sedan */}
                  <div className="bg-card border-2 border-primary rounded-2xl p-6 shadow-glow-primary">
                    <h3 className="text-xl font-montserrat font-bold mb-2 text-primary">
                      {service.name}
                    </h3>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Truck/Sedan: ${service.truckSedan}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-inter">
                      {service.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-3 font-inter">
                        Service Includes:
                      </h4>
                      <ul className="space-y-2">
                        {service.services.map((svc, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-2 font-inter"
                          >
                            <span className="text-primary font-bold mt-1">✓</span>
                            <span>{svc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a href="/#contact">
                      <Button className="w-full bg-gradient-primary hover:shadow-glow-primary">
                        Get Quote Now
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Additional Services Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-montserrat font-bold mb-12 text-center">
            Additional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Pet Hair Removal", price: 75 },
              { name: "Headlight Restoration", price: 95 },
              { name: "Ozone Treatment (Odor Elimination)", price: 50 },
              { name: "Engine Bay Cleaning", price: 75 },
              { name: "Trim Restoration", price: 75 },
              { name: "Steam Cleaning", price: 50 },
            ].map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-lg font-montserrat font-bold mb-3 text-primary">
                  {service.name}
                </h3>
                <p className="text-3xl font-montserrat font-bold text-foreground">
                  ${service.price}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Custom Quote Section */}
        <section className="bg-card border border-border rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-montserrat font-bold mb-4">
            Need a Custom Package?
          </h3>
          <p className="text-muted-foreground mb-6 font-inter max-w-2xl mx-auto">
            Have a fleet, dealership, or special project? We offer custom packages and volume discounts. Contact us for a tailored quote.
          </p>
          <a href="mailto:cornerstonemobile55@gmail.com">
            <Button variant="outline" size="lg">
              Request Custom Quote
            </Button>
          </a>
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default Pricing;
