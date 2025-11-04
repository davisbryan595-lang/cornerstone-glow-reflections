import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Terms = () => {
  const sections = [
    {
      title: "1. Agreement Overview",
      body:
        "By subscribing to a Cornerstone Mobile Detailing Membership Plan (\"Plan\" or \"Service\"), you agree to these Terms & Conditions (\"Terms\"). This agreement is between you (\"Client,\" \"Customer,\" or \"Subscriber\") and Cornerstone Mobile Detailing (\"Company,\" \"We,\" or \"Us\").",
    },
    {
      title: "2. Membership Overview",
      body:
        "Membership Plans offer ongoing maintenance detailing at exclusive member pricing. These plans are available only to qualified customers who have completed an Initial Full Detail or equivalent service to meet maintenance standards.",
    },
    {
      title: "3. Initial Service Requirement (Updated)",
      body:
        "All memberships require an initial Full Detail or Premium Interior/Exterior Detail before starting a maintenance plan. This ensures the vehicle meets Cornerstone’s cleanliness standards. Vehicles that have not been serviced by Cornerstone within the past 60 days may require a requalification detail at standard pricing before maintenance pricing can resume. The qualifying interval may be extended up to 90 days for vehicles maintained in excellent condition at the company's discretion (such as bi-monthly or seasonal members).",
    },
    {
      title: "4. Payment & Billing",
      body:
        "Memberships are billed automatically each cycle using the payment method provided. Plans renew automatically unless canceled per Section 9. Failed payments may pause service. Applicable taxes and fees apply.",
    },
    {
      title: "5. Scheduling & Availability",
      body:
        "Appointments are scheduled at regular intervals. Customers must provide access to the vehicle, a safe working area, and a water/power source within 50 ft. Missed appointments without 24-hour notice may incur a $50 fee.",
    },
    {
      title: "6. Rescheduling & Cancellations",
      body:
        "Rescheduling must be requested at least 24 hours in advance. Cancellations under 24 hours may incur a $50 fee. Memberships can be paused for up to 30 days with notice.",
    },
    {
      title: "7. Minimum Commitment Period",
      body:
        "Each membership requires a minimum of three (3) completed billing cycles before cancellation. Early cancellation will revert completed services to standard pricing, and the difference will be charged at termination.",
    },
    {
      title: "8. Vehicle Condition Policy",
      body:
        "Membership pricing applies only to vehicles kept within maintenance-level condition. Excessive buildup, stains, or pet hair may require a requalification cleaning or additional fees.",
    },
    {
      title: "9. Eligibility & Misuse Policy",
      body:
        "Membership pricing is reserved for clients maintaining consistent service intervals. If a vehicle no longer meets maintenance standards, services may be charged at standard rates. Cornerstone reserves the right to cancel memberships misused to obtain discounted one-time services.",
    },
    {
      title: "10. Weather & Safety",
      body:
        "If weather or unsafe conditions prevent service, we will reschedule at no cost. Technician safety and equipment protection are prioritized.",
    },
    {
      title: "11. Liability",
      body:
        "Cornerstone is not liable for pre-existing damage, lost items, or unsafe work environments. All reasonable care is taken during service.",
    },
    {
      title: "12. Refund Policy",
      body:
        "Refunds are not issued after service completion. Concerns must be reported within 24 hours of service for review and resolution.",
    },
    {
      title: "13. Privacy & Data",
      body:
        "Your personal information is securely stored and used only for scheduling, billing, and communication. We do not sell or share customer data.",
    },
    {
      title: "14. Updates to Terms",
      body:
        "We may update these Terms periodically. Continued membership use after updates constitutes acceptance of revised Terms.",
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
                Subscription Agreement
                <span className="block bg-gradient-primary bg-clip-text text-transparent">Terms & Conditions</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Please review these terms carefully before subscribing to a membership plan.
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
                <p className="text-muted-foreground font-inter leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Terms;
