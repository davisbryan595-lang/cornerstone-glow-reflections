import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      subsections: [
        {
          subtitle: "A. Personal Information You Provide",
          body:
            "We may collect personal information when you book an appointment, submit a quote request, contact us via form, email, or phone, subscribe to newsletters or promotions, or make a payment. This may include: Name, Phone number, Email address, Home or business address, Vehicle information, and Payment information (handled securely through third-party processors such as Stripe or Jobber).",
        },
        {
          subtitle: "B. Automatically Collected Information",
          body:
            "When you visit our website, we may automatically collect IP address, Browser type & device information, Pages visited, Date/time of visit, Referring links, and Basic analytical data through tools like Google Analytics, Meta Pixel, or similar. This information helps us improve performance, user experience, and marketing effectiveness.",
        },
      ],
    },
    {
      title: "2. How We Use Your Information",
      body:
        "We use your information to schedule and manage service appointments, provide quotes and customer support, process payments securely, improve website experience and performance, send appointment reminders and service updates, provide promotional offers and marketing communications (you may opt-out at any time), improve our marketing and advertising strategies, and comply with legal obligations. We never sell your personal information.",
    },
    {
      title: "3. How We Share Your Information",
      body:
        "We may share your information only with Service providers (Jobber, Google Workspace, Stripe, payment processing platforms, website hosting platforms, email/SMS providers), Marketing tools (Google, Facebook/Instagram Ads, scheduling integrations), and Legal authorities if required by law. We do not share or sell your information to third parties for their own marketing purposes.",
    },
    {
      title: "4. Cookies & Tracking Technologies",
      body:
        "We may use cookies, pixels, and tracking technologies to improve website functionality, analyze website traffic, enhance user experience, and deliver targeted advertising. You may disable cookies via your browser settings, but some website functions may not work correctly.",
    },
    {
      title: "5. Data Security",
      body:
        "We use commercially reasonable measures to protect the security of your information, including secure encrypted payment processors, HTTPS website protocol, and restricted access to customer data. However, no method of transmission over the internet is 100% secure. By using our website, you acknowledge this risk.",
    },
    {
      title: "6. Your Rights & Choices",
      body:
        "You may request at any time: Access to your personal information, Corrections or updates to your information, Deletion of your information (excluding data we must keep for legal reasons), or Opt-out of marketing emails or texts. To request changes, email us at: cornerstonemobile55@gmail.com",
    },
    {
      title: "7. Third-Party Links",
      body:
        "Our website may include links to third-party sites. We are not responsible for the privacy practices or content of those websites.",
    },
    {
      title: "8. Data Retention",
      body:
        "We retain customer information only as long as necessary to provide services, maintain business records, and comply with legal and tax obligations.",
    },
    {
      title: "9. Children's Privacy",
      body:
        "We do not knowingly collect information from individuals under the age of 13. If you believe a minor has provided information, contact us immediately.",
    },
    {
      title: "10. Changes to This Privacy Policy",
      body:
        "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated Effective Date.",
    },
    {
      title: "11. Contact Us",
      body:
        "If you have questions about this Privacy Policy or how your data is handled, contact us at: Cornerstone Mobile Detailing LLC, Email: cornerstonemobile55@gmail.com, Phone: 980-312-4236, Location: Charlotte, North Carolina",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" style={{ marginTop: 100 }}>
        {/* Hero */}
        <section className="py-20 relative overflow-hidden pt-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
                Privacy Policy
                <span className="block bg-gradient-primary bg-clip-text text-transparent">Your Data Protection</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                We are committed to protecting your privacy and being transparent about how we collect and use your information.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl space-y-8">
            {sections.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h2 className="text-xl font-montserrat font-bold mb-3">{s.title}</h2>
                {s.subsections ? (
                  <div className="space-y-4">
                    {s.subsections.map((sub, subIdx) => (
                      <div key={subIdx}>
                        <h3 className="font-semibold text-base mb-2">{sub.subtitle}</h3>
                        <p className="text-muted-foreground font-inter leading-relaxed">{sub.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-inter leading-relaxed">{s.body}</p>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Privacy;
