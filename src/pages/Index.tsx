import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Team from "@/components/Team";
import Areas from "@/components/Areas";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SpecialOfferPopup from "@/components/SpecialOfferPopup";
import BackToTopButton from "@/components/BackToTopButton";

const Index = () => {
  const [loading, setLoading] = useState(() => {
    // Check if preloader has already been shown in this session
    if (typeof window !== "undefined") {
      const hasShown = sessionStorage.getItem("preloader-shown");
      return !hasShown;
    }
    return true;
  });

  useEffect(() => {
    if (loading) {
      // Minimum loading time of 3 seconds
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("preloader-shown", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <main className="min-h-screen bg-background font-inter">
          <Navbar />
          <Hero />
          <About />
          <Services />
          <Gallery />
          <Team />
          <Areas />
          <Contact />
          <Footer />
          <SpecialOfferPopup />
          <BackToTopButton />
        </main>
      )}
    </>
  );
};

export default Index;
