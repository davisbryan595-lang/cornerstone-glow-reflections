let stripe: any;

// Lazy load Stripe to avoid issues in development
const getStripe = async () => {
  if (!stripe) {
    try {
      const StripeModule = await import('stripe');
      stripe = new StripeModule.default(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2024-11-20' as any,
      });
    } catch (error) {
      console.warn('Failed to load Stripe SDK:', error);
    }
  }
  return stripe;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      planId,
      planName,
      amount,
      email,
      customerId,
      successUrl,
      cancelUrl,
      paymentMethodId,
      serviceType,
      customerName,
      customerEmail,
      customerPhone,
      subject,
      message,
    } = req.body;

    const stripeClient = await getStripe();

    if (!stripeClient) {
      return res.status(500).json({
        error: 'Stripe is not properly configured',
      });
    }

    // Handle direct payment method flow (from flip card)
    if (paymentMethodId && amount && (serviceType || customerEmail)) {
      try {
        const paymentIntent = await stripeClient.paymentIntents.create({
          amount: Math.round(amount),
          currency: 'usd',
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: false,
          },
          metadata: {
            serviceType,
            customerName,
            customerEmail,
            customerPhone,
            subject,
            message,
          },
          receipt_email: customerEmail || email,
        });

        if (paymentIntent.status === 'succeeded') {
          return res.status(200).json({
            success: true,
            paymentIntentId: paymentIntent.id,
            message: 'Payment successful',
          });
        } else if (paymentIntent.status === 'requires_action') {
          return res.status(200).json({
            success: false,
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            message: 'Payment requires additional action',
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'Payment failed',
          });
        }
      } catch (paymentError: any) {
        console.error('Payment method error:', paymentError);
        return res.status(400).json({
          success: false,
          error: paymentError.message || 'Payment processing failed',
        });
      }
    }

    // Handle checkout session flow (existing membership plans)
    if (!planId || !planName || !amount || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: `Membership Plan: ${planName}`,
            },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.VITE_SUPABASE_URL || 'http://localhost:5173'}/subscription-member?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.VITE_SUPABASE_URL || 'http://localhost:5173'}/checkout?plan=${planId}`,
      customer_email: email,
      metadata: {
        planId,
        customerId: customerId || email,
      },
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      clientSecret: session.client_secret,
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
}
