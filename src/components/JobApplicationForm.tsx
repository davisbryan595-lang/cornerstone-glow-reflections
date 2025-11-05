import { useState } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobApplicationForm = ({ isOpen, onClose }: JobApplicationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description:
        "Thank you for your interest! We'll review your application and contact you soon.",
    });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-montserrat">
            Apply for a Job
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block font-inter">
                First Name *
              </label>
              <Input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
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
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="bg-background border-border focus:border-primary"
                placeholder="Doe"
              />
            </div>

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

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow-primary mt-6"
            >
              Apply
            </Button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;
