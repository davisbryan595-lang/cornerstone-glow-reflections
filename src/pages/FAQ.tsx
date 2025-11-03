import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      question: "How long does a detail take?",
      answer:
        "The duration depends on the service selected. An interior detail typically takes 2-3 hours, an exterior detail takes 2-4 hours, and a full detail takes 4-6 hours. Paint correction services take longer, usually 4-8 hours depending on the condition of your vehicle.",
    },
    {
      id: 2,
      question: "Do I need to be home during the service?",
      answer:
        "No, you don't need to be home during the service. We just need access to your vehicle and a safe place to park it. If you have an exterior detail, we'll need access to water and power within 50 feet of the vehicle.",
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and payment apps. For membership and subscription plans, you can set up automatic payments using your preferred payment method.",
    },
    {
      id: 4,
      question: "Is your service mobile?",
      answer:
        "Yes! We come to you. We're a mobile detailing service, so we bring our equipment and perform the service at your location. We operate throughout the Charlotte area.",
    },
    {
      id: 5,
      question: "What is your cancellation policy?",
      answer:
        "We require 24 hours notice for cancellations. Cancellations within 24 hours may incur a $50 fee. Memberships can be paused for up to 30 days with notice.",
    },
    {
      id: 6,
      question: "Do you offer warranty or guarantee?",
      answer:
        "We stand behind our work. If you have any concerns about the quality of your service, please report them within 24 hours of service completion, and we'll review and address the issue.",
    },
    {
      id: 7,
      question: "Can you detail my commercial fleet?",
      answer:
        "Absolutely! We offer fleet detailing services for businesses and dealerships. We can create custom packages to meet your fleet's needs. Please contact us for a quote.",
    },
    {
      id: 8,
      question: "What is the membership program?",
      answer:
        "Our membership program offers regular maintenance detailing at exclusive member pricing. Members enjoy discounted rates for consistent, scheduled services. Membership requires an initial full detail and a minimum 3-cycle commitment.",
    },
    {
      id: 9,
      question: "How often should I get my car detailed?",
      answer:
        "For optimal results, we recommend a full detail every 6-12 months, depending on usage and conditions. Our maintenance packages offer regular service at more frequent intervals to keep your vehicle in pristine condition.",
    },
    {
      id: 10,
      question: "Is ceramic coating worth it?",
      answer:
        "Ceramic coatings provide excellent protection and shine. They protect your paint from UV rays, contaminants, and minor scratches, lasting 6 months to 3 years depending on the product and care. We recommend ceramic coating to customers who want long-term paint protection.",
    },
    {
      id: 11,
      question: "Can you remove paint swirls?",
      answer:
        "Yes! Paint swirls are caused by improper washing and drying techniques. Our paint correction services can remove swirls and restore your paint's clarity. We offer 1, 2, and 3-step correction options depending on the severity of the damage.",
    },
    {
      id: 12,
      question: "How do I schedule an appointment?",
      answer:
        "You can schedule an appointment by filling out our contact form or calling us at 980-312-4236. We'll confirm your preferred date and time and send you a reminder before your appointment.",
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" style={{ marginTop: 100 }}>
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
                Frequently Asked{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Find answers to common questions about our services and processes
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 relative" ref={ref}>
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors duration-300 group"
                  >
                    <h3 className="text-lg font-montserrat font-semibold text-left group-hover:text-primary transition-colors">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                        expandedId === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedId === item.id ? "auto" : 0,
                      opacity: expandedId === item.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-card/50"
                  >
                    <div className="px-6 py-4 text-muted-foreground font-inter leading-relaxed border-t border-border">
                      {item.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 text-center bg-gradient-to-r from-card via-primary/5 to-card border border-primary/20 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-montserrat font-bold mb-4">
                Didn't find your answer?
              </h3>
              <p className="text-muted-foreground mb-6 font-inter">
                Contact us directly for more information or to discuss your specific needs.
              </p>
              <a href="mailto:cornerstonemobile55@gmail.com" className="inline-block">
                <button className="px-8 py-3 bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 rounded-lg font-semibold">
                  Get in Touch
                </button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
