import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { StripeElementChangeEvent } from '@stripe/stripe-js';

interface StripePaymentFormProps {
  amount: number;
  planName: string;
  onSuccess: (paymentMethodId: string) => void;
  isLoading?: boolean;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  planName,
  onSuccess,
  isLoading = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: StripeElementChangeEvent) => {
    setCardComplete(event.complete);
    if (event.error) {
      toast({
        title: 'Card Error',
        description: event.error.message,
        variant: 'destructive' as any,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: 'Error',
        description: 'Stripe is not loaded. Please refresh and try again.',
        variant: 'destructive' as any,
      });
      return;
    }

    if (!cardComplete) {
      toast({
        title: 'Incomplete Card',
        description: 'Please enter complete card details.',
        variant: 'destructive' as any,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create a payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast({
          title: 'Payment Error',
          description: error.message || 'Failed to process card',
          variant: 'destructive' as any,
        });
        return;
      }

      if (paymentMethod?.id) {
        onSuccess(paymentMethod.id);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive' as any,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="card-element" className="block mb-3">
          Card Details
        </Label>
        <div className="p-4 border border-input rounded-md bg-white">
          <CardElement
            id="card-element"
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
      </div>

      <div className="pt-4 border-t space-y-2">
        <div className="flex justify-between text-sm">
          <span>Plan</span>
          <span className="font-medium">{planName}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${(amount / 100).toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || isLoading || !cardComplete}
        className="w-full bg-gradient-primary"
        size="lg"
      >
        {isProcessing || isLoading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your payment information is encrypted and secure. You will not be charged until you complete the purchase.
      </p>
    </form>
  );
};

export default StripePaymentForm;
