import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Mail, Phone, Briefcase, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

const Careers = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
  });

  const jobs = [
    {
      id: 1,
      title: "Auto Detailing Technician",
      department: "Operations",
      description:
        "We're looking for experienced auto detailing technicians to join our growing team. You'll work on a variety of vehicles and provide exceptional service to our customers.",
      requirements: [
        "2+ years of auto detailing experience",
        "Attention to detail",
        "Excellent customer service skills",
        "Ability to work independently and as part of a team",
      ],
    },
    {
      id: 2,
      title: "Ceramic Coating Specialist",
      department: "Specialty Services",
      description:
        "Join us as a Ceramic Coating Specialist and master the art of premium ceramic coating application. You'll work with high-end vehicles and luxury packages.",
      requirements: [
        "Ceramic coating certification preferred",
        "Experience with paint protection",
        "Knowledge of various coating brands",
        "Detail-oriented approach",
      ],
    },
    {
      id: 3,
      title: "Customer Service Representative",
      department: "Sales & Support",
      description:
        "Help our customers schedule appointments and answer questions about our services. You'll be the first point of contact for our growing client base.",
      requirements: [
        "Excellent communication skills",
        "Customer service experience",
        "Ability to multitask",
        "Proficiency with scheduling software",
      ],
    },
    {
      id: 4,
      title: "Fleet Manager",
      department: "Management",
      description:
        "Manage our fleet of mobile detailing vehicles and coordinate with the team. You'll ensure all equipment is maintained and schedules are optimized.",
      requirements: [
        "Fleet management experience",
        "Leadership skills",
        "Maintenance knowledge",
        "Organizational abilities",
      ],
    },
    {
      id: 5,
      title: "Social Media Marketer",
      department: "Marketing",
      description:
        "Create engaging content and manage our social media presence across multiple platforms. You'll help grow our brand awareness and engage with our customer community.",
      requirements: [
        "2+ years of social media marketing experience",
        "Content creation skills",
        "Knowledge of social media analytics",
        "Creative and strategic thinking",
        "Experience with scheduling tools and analytics platforms",
      ],
    },
    {
      id: 6,
      title: "Video Producer & Photographer",
      department: "Marketing",
      description:
        "Produce high-quality video content and photography for our marketing campaigns. You'll showcase our services and create compelling visual stories that connect with our audience.",
      requirements: [
        "Professional video production and photography experience",
        "Proficiency with editing software (Adobe Creative Suite or similar)",
        "Portfolio of previous work",
        "Creative vision and storytelling ability",
        "Ability to work independently and meet deadlines",
      ],
    },
  ];

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "CV file must be less than 5MB",
        });
        return;
      }
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
        });
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) {
      toast({
        title: "No job selected",
        description: "Please select a job position",
      });
      return;
    }
    if (!cvFile) {
      toast({
        title: "CV required",
        description: "Please upload your CV",
      });
      return;
    }

    toast({
      title: "Application Submitted!",
      description:
        "Thank you for applying! We'll review your application and contact you soon.",
    });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      experience: "",
      message: "",
    });
    setCvFile(null);
    setSelectedJob(null);
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
                Join Our{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Team
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Be part of a growing company dedicated to excellence in auto
                detailing
              </p>
            </motion.div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4" ref={ref}>
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedJob(job.id.toString())}
                  className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedJob === job.id.toString()
                      ? "bg-card border-primary shadow-glow-primary"
                      : "bg-card/50 border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-bold">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-inter">
                        {job.department}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-inter mb-4">
                    {job.description}
                  </p>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground font-inter flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Application Form */}
            {selectedJob && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-montserrat font-bold">
                    Apply Now
                  </h2>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-muted-foreground mb-6 font-inter">
                  Applying for:{" "}
                  <span className="font-semibold text-primary">
                    {jobs.find((j) => j.id.toString() === selectedJob)?.title}
                  </span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block font-inter">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="bg-background border-border focus:border-primary"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block font-inter">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: e.target.value,
                          })
                        }
                        className="bg-background border-border focus:border-primary"
                        placeholder="Doe"
                      />
                    </div>
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
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block font-inter">
                        Phone Number *
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
                      Years of Experience *
                    </label>
                    <Input
                      type="number"
                      required
                      min="0"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience: e.target.value,
                        })
                      }
                      className="bg-background border-border focus:border-primary"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block font-inter">
                      Cover Letter / Message
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="bg-background border-border focus:border-primary min-h-32"
                      placeholder="Tell us why you'd be great for this position..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block font-inter">
                      Upload Your CV (PDF or Word) *
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer flex items-center justify-center gap-3 group"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-sm">
                          {cvFile ? cvFile.name : "Click to upload CV"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF or Word document (max 5MB)
                        </p>
                      </div>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVChange}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 bg-gradient-primary hover:shadow-glow-primary"
                    >
                      Submit Application
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-card/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold mb-4">
                Have Questions?
              </h2>
              <p className="text-muted-foreground font-inter">
                Contact us for more information about career opportunities
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a
                href="tel:980-312-4236"
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary transition-all"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-inter">
                    Phone
                  </p>
                  <p className="font-medium">980-312-4236</p>
                </div>
              </a>
              <a
                href="mailto:cornerstonemobile55@gmail.com"
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary transition-all"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-inter">
                    Email
                  </p>
                  <p className="font-medium">cornerstonemobile55@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default Careers;
