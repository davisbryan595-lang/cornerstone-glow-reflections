import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Clock, Facebook, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentFlipCard from "./PaymentFlipCard";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
);

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms & Conditions to proceed.",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      subject: "",
      message: "",
    });
    setAgreed(false);

    // Redirect to home page and scroll to contact form
    navigate("/");
    setTimeout(() => {
      const contactElement = document.getElementById("contact-form");
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const openHours = [
    "Monday: 24 Hours",
    "Tuesday: 24 Hours",
    "Wednesday: 24 Hours",
    "Thursday: 24 Hours",
    "Friday: 24 Hours",
    "Saturday: 24 Hours",
    "Sunday: Closed",
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "980-312-4236",
      link: "tel:980-312-4236",
    },
    {
      icon: Mail,
      label: "Email",
      value: "cornerstonemobile55@gmail.com",
      link: "mailto:cornerstonemobile55@gmail.com",
    },
    {
      icon: Clock,
      label: "Hours",
      value: openHours,
      link: null,
      isHours: true,
    },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-background" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider font-inter">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mt-4 mb-6">
            Ready to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Get Started?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-inter">
            Tell us about your vehicle and what solution you need
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-montserrat font-bold mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-primary transition-all duration-300">
                      <info.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-inter">
                        {info.label}
                      </p>
                      {info.isHours ? (
                        <div className="font-medium font-inter space-y-1">
                          {(info.value as string[]).map((hour, idx) => (
                            <p key={idx}>{hour}</p>
                          ))}
                        </div>
                      ) : info.link ? (
                        <a
                          href={info.link}
                          className="font-medium hover:text-primary transition-colors font-inter"
                        >
                          {info.value as string}
                        </a>
                      ) : (
                        <p className="font-medium font-inter">{info.value as string}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-montserrat font-bold mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:shadow-glow-primary transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center hover:border-accent hover:shadow-glow-accent transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="rounded-xl overflow-hidden border border-primary/30 shadow-lg h-64"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d415740.1283783033!2d-81.13089384999999!3d35.2270869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88541fc4fc381a81%3A0x884650e6bf43d164!2sCharlotte%2C%20NC!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </motion.div>

          {/* Contact Form / Payment Card */}
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="hover:border-primary/50 transition-all duration-300"
          >
            <Elements stripe={stripePromise}>
              <PaymentFlipCard
                onSubmitContact={(data) => {
                  setFormData(data);
                  toast({
                    title: "Message Sent!",
                    description: "We'll get back to you within 24 hours.",
                  });
                }}
              />
            </Elements>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
