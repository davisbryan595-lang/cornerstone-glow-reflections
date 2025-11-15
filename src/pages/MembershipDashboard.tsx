import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Bell, Gift, DollarSign, Zap, Heart, Shield, Calendar, Download, Settings, LogOut, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import db from "@/lib/database";

const MembershipDashboard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, membership, isMember, signOut } = useAuth();
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [discountCodes, setDiscountCodes] = useState<any[]>([]);
  const [accessCode, setAccessCode] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMember) {
      navigate("/subscription-member");
      return;
    }
    loadDashboardData();
  }, [isMember, profile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (profile?.user_id) {
        const codes = await db.discountCodes.listActive();
        setDiscountCodes(codes.slice(0, 3));

        const codes_data = await db.accessCodes.listByUser(profile.user_id);
        if (codes_data.length > 0) {
          setAccessCode(codes_data[0]);
        }

        const invoices_data = await db.invoices.listByUser(profile.user_id);
        setInvoices(invoices_data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const notifications = [
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      message: `Your $50.00 membership payment was processed successfully.`,
      timestamp: "Today",
      read: true,
    },
    {
      id: 2,
      type: "offer",
      title: "Exclusive Offer Available",
      message: "Get 20% off on ceramic coating services this month. Limited to members only!",
      timestamp: "2 days ago",
      read: false,
    },
    {
      id: 3,
      type: "maintenance",
      title: "Scheduled Maintenance Coming Up",
      message: "Your next maintenance service is scheduled for next week. Confirm your appointment.",
      timestamp: "3 days ago",
      read: true,
    },
    {
      id: 4,
      type: "upgrade",
      title: "Upgrade Opportunity",
      message: "Upgrade to Elite membership and get priority scheduling and 24/7 concierge support.",
      timestamp: "1 week ago",
      read: true,
    },
  ];

  const exclusiveOffers = [
    {
      id: 1,
      title: "Ceramic Coating Touch-Up",
      description: "Keep your vehicle's protection pristine with our exclusive ceramic touch-up service.",
      discount: "20%",
      originalPrice: "$199",
      memberPrice: "$159",
      expires: "Jan 31, 2025",
      icon: Shield,
    },
    {
      id: 2,
      title: "Premium Interior Deep Clean",
      description: "Professional deep cleaning for your vehicle's interior, available exclusively for members.",
      discount: "15%",
      originalPrice: "$249",
      memberPrice: "$211",
      expires: "Jan 31, 2025",
      icon: Heart,
    },
    {
      id: 3,
      title: "Paint Correction Package",
      description: "Eliminate swirl marks and restore your paint's original shine with our expert correction service.",
      discount: "25%",
      originalPrice: "$349",
      memberPrice: "$262",
      expires: "Feb 14, 2025",
      icon: Zap,
    },
    {
      id: 4,
      title: "Water Spot Removal Service",
      description: "Premium water spot and mineral deposit removal to restore your vehicle's glass and finish.",
      discount: "30%",
      originalPrice: "$149",
      memberPrice: "$104",
      expires: "Feb 28, 2025",
      icon: Zap,
    },
    {
      id: 5,
      title: "Undercarriage Wash & Protection",
      description: "Deep clean undercarriage with rust protection coating, exclusive for members only.",
      discount: "20%",
      originalPrice: "$299",
      memberPrice: "$239",
      expires: "Mar 15, 2025",
      icon: Shield,
    },
    {
      id: 6,
      title: "Leather Conditioning Treatment",
      description: "Premium leather care and conditioning to keep your interior supple and protected.",
      discount: "18%",
      originalPrice: "$179",
      memberPrice: "$147",
      expires: "Feb 28, 2025",
      icon: Heart,
    },
  ];

  const maintenancePlans = [
    {
      id: 1,
      month: "January 2025",
      services: [
        { name: "Monthly Exterior Wash & Dry", status: "completed", date: "Jan 5" },
        { name: "Interior Vacuum & Wipe Down", status: "completed", date: "Jan 5" },
      ],
      upcoming: true,
    },
    {
      id: 2,
      month: "February 2025",
      services: [
        { name: "Full Detail Service", status: "scheduled", date: "Feb 10" },
        { name: "Paint Protection Inspection", status: "scheduled", date: "Feb 10" },
      ],
      upcoming: false,
    },
    {
      id: 3,
      month: "March 2025",
      services: [
        { name: "Ceramic Coating Refresh", status: "pending", date: "TBD" },
        { name: "Interior Deep Clean", status: "pending", date: "TBD" },
      ],
      upcoming: false,
    },
  ];

  const membershipBenefits = [
    { icon: Zap, title: "Exclusive Pricing", desc: "Locked-in discounted rates on all services" },
    { icon: Calendar, title: "Priority Scheduling", desc: "Book at preferred times with priority access" },
    { icon: Shield, title: "Paint Protection", desc: "Extended sealant protection included" },
    { icon: Heart, title: "Premium Care", desc: "Extra attention to detail on every service" },
  ];

  const downloadInvoice = (invoice: any) => {
    const csv = `Invoice #,Date,Amount,Status\n${invoice.id},${invoice.issued_at},${invoice.final_amount},${invoice.status}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `invoice-${invoice.id}.csv`;
    link.click();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" style={{ marginTop: 100 }}>
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden pt-32 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
                <p className="text-primary font-semibold text-sm font-inter">Welcome Back, Member</p>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
                Your Membership{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-xl text-muted-foreground font-inter">
                Manage your membership, view exclusive offers, and keep track of your maintenance plans.
              </p>
              <div className="mt-6 flex gap-3">
                <Button className="bg-gradient-primary" onClick={() => navigate("/member-settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Membership Status Card */}
        <section className="py-16 bg-gradient-to-r from-card via-primary/10 to-card border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl" ref={ref}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <h2 className="text-3xl font-montserrat font-bold mb-6">Your Membership Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Plan</p>
                  <p className="font-semibold text-lg capitalize mt-2">
                    {membership?.plan_id?.replace(/-/g, " ") || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                  <p className="font-semibold text-lg text-emerald-500 mt-2 capitalize">
                    {membership?.status || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Payment Status</p>
                  <p className="font-semibold text-lg text-blue-500 mt-2 capitalize">
                    {membership?.payment_status || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Next Billing</p>
                  <p className="font-semibold text-lg mt-2">
                    {membership?.next_billing_at 
                      ? new Date(membership.next_billing_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Access Code */}
              {accessCode && (
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-4">Your Access Code</h3>
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                    <code className="flex-1 font-mono text-sm font-bold">
                      {showAccessCode ? accessCode.code : "•••••••••••"}
                    </code>
                    <button
                      onClick={() => setShowAccessCode(!showAccessCode)}
                      className="p-2 hover:bg-background rounded"
                    >
                      {showAccessCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(accessCode.code);
                        toast({
                          title: "Copied",
                          description: "Access code copied to clipboard",
                        });
                      }}
                      className="px-3 py-2 bg-primary/10 text-primary border border-primary rounded hover:bg-primary/20"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use this code to access exclusive member benefits and services.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-3xl font-montserrat font-bold">Notifications</h2>
              </div>
              <p className="text-muted-foreground">Stay updated with your membership and service notifications</p>
            </motion.div>

            <div className="space-y-3">
              {notifications.map((notif, idx) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`p-4 border rounded-lg transition-all ${
                    notif.read
                      ? "bg-background/50 border-border"
                      : "bg-primary/5 border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      notif.type === 'offer' ? 'bg-amber-500' :
                      notif.type === 'payment' ? 'bg-green-500' :
                      notif.type === 'maintenance' ? 'bg-blue-500' :
                      'bg-primary'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{notif.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                        </div>
                        {!notif.read && (
                          <div className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                            New
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{notif.timestamp}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Exclusive Offers & Discounts */}
        <section className="py-16 bg-card/30 border-y border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <h2 className="text-3xl font-montserrat font-bold">Exclusive Member Offers</h2>
              </div>
              <p className="text-muted-foreground">Get exclusive discounts and special offers available only to our members</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {exclusiveOffers.map((offer, idx) => {
                const IconComponent = offer.icon;
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                        {offer.discount} OFF
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
                    
                    <div className="bg-background/50 rounded-lg p-3 mb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-primary">{offer.memberPrice}</span>
                        <span className="text-sm line-through text-muted-foreground">{offer.originalPrice}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Member pricing</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Expires: {offer.expires}</span>
                      <Button size="sm" className="bg-gradient-primary">
                        Claim Offer
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Maintenance Plans */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <h2 className="text-3xl font-montserrat font-bold">Your Maintenance Plans</h2>
              </div>
              <p className="text-muted-foreground">View your scheduled maintenance services and upcoming care plans</p>
            </motion.div>

            <div className="space-y-4">
              {maintenancePlans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div className={`p-4 ${plan.upcoming ? 'bg-blue-50 border-b border-border' : 'bg-background/50 border-b border-border'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{plan.month}</h3>
                      {plan.upcoming && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                          Current Month
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {plan.services.map((service, serviceIdx) => (
                      <div key={serviceIdx} className="p-4 flex items-center gap-3">
                        {service.status === 'completed' ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : service.status === 'scheduled' ? (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{service.status} • {service.date}</p>
                        </div>
                        {service.status === 'scheduled' && (
                          <Button size="sm" variant="outline">
                            Confirm
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Benefits */}
        <section className="py-16 bg-card/30 border-y border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-montserrat font-bold mb-2">Your Member Benefits</h2>
              <p className="text-muted-foreground">Enjoy these exclusive perks with your membership</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {membershipBenefits.map((benefit, idx) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mb-3">
                      <IconComponent className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Invoices */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h2 className="text-3xl font-montserrat font-bold">Billing & Invoices</h2>
              </div>
              <p className="text-muted-foreground">View and download your payment history</p>
            </motion.div>

            {invoices.length > 0 ? (
              <div className="space-y-2 bg-card border border-border rounded-lg overflow-hidden">
                {invoices.slice(0, 5).map((invoice, idx) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="p-4 border-b last:border-b-0 border-border flex items-center justify-between hover:bg-background/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">Invoice #{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(invoice.issued_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${invoice.final_amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <button
                        onClick={() => downloadInvoice(invoice)}
                        className="p-2 hover:bg-background rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">No invoices yet. Your first invoice will appear here after your first payment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 bg-card/30 border-y border-border">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-montserrat font-bold mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-6">
                Have questions about your membership, offers, or maintenance plans? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">Contact Support</Button>
                <Button className="bg-gradient-primary">Schedule Service</Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MembershipDashboard;
