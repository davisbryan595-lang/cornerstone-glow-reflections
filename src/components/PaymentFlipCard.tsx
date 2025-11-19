import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { SERVICE_PRICING, SERVICE_NAMES, formatPrice } from '@/lib/servicePricing';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
}

interface PaymentFlipCardProps {
  onSubmitContact?: (data: ContactFormData) => void;
}

const PaymentFlipCard: React.FC<PaymentFlipCardProps> = ({ onSubmitContact }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    subject: '',
    message: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleFlip = () => {
    if (!isFlipped) {
      // Validate form before flipping
      if (!formData.name || !formData.email || !formData.phone || !formData.service) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in name, email, phone, and select a service.',
          variant: 'destructive' as any,
        });
        return;
      }
      if (!agreed) {
        toast({
          title: 'Terms Required',
          description: 'Please agree to the Terms & Conditions to proceed.',
          variant: 'destructive' as any,
        });
        return;
      }
    }
    setIsFlipped(!isFlipped);
  };

  const servicePrice = formData.service ? SERVICE_PRICING[formData.service] : null;
  const serviceName = formData.service ? SERVICE_NAMES[formData.service] : '';
  const hasPrice = servicePrice && servicePrice > 0;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasPrice) {
      toast({
        title: 'Custom Pricing',
        description:
          'This service requires custom pricing. Please contact us for a quote.',
        variant: 'destructive' as any,
      });
      return;
    }

    if (!stripe || !elements) {
      toast({
        title: 'Error',
        description: 'Payment system is not loaded. Please try again.',
        variant: 'destructive' as any,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      });

      if (error) {
        toast({
          title: 'Payment Error',
          description: error.message || 'Failed to process card',
          variant: 'destructive' as any,
        });
        setIsProcessing(false);
        return;
      }

      // Call backend to create payment intent
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: servicePrice,
          paymentMethodId: paymentMethod?.id,
          serviceType: formData.service,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const result = await response.json();

      toast({
        title: 'Payment Successful!',
        description: `Your payment of ${formatPrice(servicePrice)} has been processed. We'll contact you soon to schedule your service.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        subject: '',
        message: '',
      });
      setAgreed(false);
      setIsFlipped(false);

      if (onSubmitContact) {
        onSubmitContact(formData);
      }
    } catch (error: any) {
      toast({
        title: 'Payment Error',
        description: error?.message || 'An error occurred while processing your payment.',
        variant: 'destructive' as any,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="perspective w-full h-full min-h-[700px] relative">
      {/* 3D Flip Container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full"
      >
        {/* Front Side - Contact Form */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="w-full bg-card border border-border rounded-2xl p-8"
        >
          <h3 className="text-2xl font-montserrat font-bold mb-6">
            Book Your Service
          </h3>
          <form onSubmit={(e) => { e.preventDefault(); handleFlip(); }} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block font-inter">
                Name *
              </label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background border-border focus:border-primary"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block font-inter">
                Service Type *
              </label>
              <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paint-correction">
                    Paint Correction - {formatPrice(SERVICE_PRICING['paint-correction'])}
                  </SelectItem>
                  <SelectItem value="auto-detailing">
                    Auto Detailing - {formatPrice(SERVICE_PRICING['auto-detailing'])}
                  </SelectItem>
                  <SelectItem value="headlight-trim-restoration">
                    Headlight & Trim Restoration - {formatPrice(SERVICE_PRICING['headlight-trim-restoration'])}
                  </SelectItem>
                  <SelectItem value="custom">Custom Package - Contact for pricing</SelectItem>
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
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="bg-background border-border focus:border-primary"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block font-inter">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                type="submit"
                size="lg"
                disabled={!agreed}
                className="flex-1 bg-gradient-primary hover:shadow-glow-primary"
              >
                <span className="flex items-center gap-2">
                  Book & Pay
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={(e) => { e.preventDefault(); }}
              >
                Send Message
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Back Side - Payment Form */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 w-full bg-card border border-border rounded-2xl p-8"
        >
          <h3 className="text-2xl font-montserrat font-bold mb-2">
            Payment Details
          </h3>
          <p className="text-muted-foreground mb-6 font-inter">
            Service: <span className="font-semibold text-foreground">{serviceName}</span>
          </p>

          {hasPrice && (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Service Amount</span>
                  <span className="font-semibold text-lg">{formatPrice(servicePrice)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block font-inter">
                  Card Details
                </label>
                <div className="bg-background border border-border rounded-lg p-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: 'inherit',
                          fontFamily: 'inherit',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-inter">
                  Your payment will be securely processed with Stripe encryption.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleFlip}
                  disabled={isProcessing}
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </span>
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing || !stripe}
                  className="flex-1 bg-gradient-primary hover:shadow-glow-primary"
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(servicePrice)}`}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center font-inter">
                By clicking Pay, you authorize Cornerstone Mobile Detailing to charge your card.
              </p>
            </form>
          )}

          {!hasPrice && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-amber-600 font-inter">
                  This service requires custom pricing. Please contact us for a quote.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleFlip}
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Form
                </span>
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentFlipCard;
