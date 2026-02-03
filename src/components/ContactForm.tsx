import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive' as any,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: '045ecce7-3791-4ad7-946c-86810d670291',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you! We\'ll get back to you shortly.',
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to send message. Please try again.',
          variant: 'destructive' as any,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'An error occurred while sending your message.',
        variant: 'destructive' as any,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full bg-card border border-border rounded-2xl p-8"
    >
      <h3 className="text-2xl font-montserrat font-bold mb-6">
        Get In Touch
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block font-inter">
            Name *
          </label>
          <Input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
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
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="bg-background border-border focus:border-primary"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block font-inter">
            Subject *
          </label>
          <Input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="bg-background border-border focus:border-primary"
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block font-inter">
            Message *
          </label>
          <Textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            className="bg-background border-border focus:border-primary min-h-32"
            placeholder="Tell us about your vehicle and what solution you need..."
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full bg-gradient-primary hover:shadow-glow-primary"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
