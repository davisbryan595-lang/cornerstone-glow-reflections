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
import PaymentFlipCard from "./PaymentFlipCard";

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
  const [agreed, setAgreed] = useState(false);
  const [usePaymentFlow, setUsePaymentFlow] = useState(false);
  const elements = useElements();

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
            {usePaymentFlow ? (
              <PaymentFlipCard
                onSubmitContact={(data) => {
                  setFormData(data);
                  toast({
                    title: "Message Sent!",
                    description: "We'll get back to you within 24 hours.",
                  });
                  setUsePaymentFlow(false);
                }}
              />
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-2xl font-montserrat font-bold mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block font-inter">
                      Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-background border-border focus:border-primary"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block font-inter">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-background border-border focus:border-primary"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block font-inter">
                        Phone *
                      </label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="bg-background border-border focus:border-primary"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block font-inter">
                      Service Type *
                    </label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        setFormData({ ...formData, service: value })
                      }
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paint-correction">
                          Paint Correction
                        </SelectItem>
                        <SelectItem value="auto-detailing">
                          Auto Detailing
                        </SelectItem>
                        <SelectItem value="headlight-trim-restoration">
                          Headlight & Trim Restoration
                        </SelectItem>
                        <SelectItem value="custom">Custom Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block font-inter">
                      Subject
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="bg-background border-border focus:border-primary"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block font-inter">
                      Message *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="bg-background border-border focus:border-primary min-h-32"
                      placeholder="Tell us about your vehicle and what solution you need..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agree"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(!!checked)}
                      className="mt-1"
                    />
                    <label htmlFor="agree" className="text-sm text-muted-foreground font-inter">
                      I agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and Policy.
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      size="lg"
                      disabled={!agreed}
                      onClick={() => setUsePaymentFlow(true)}
                      className="flex-1 bg-gradient-primary hover:shadow-glow-primary"
                    >
                      Book & Pay
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!agreed}
                      variant="outline"
                      className="flex-1"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
