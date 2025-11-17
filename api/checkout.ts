import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

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
    } = req.body;

    if (!planId || !planName || !amount || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = await stripe.checkout.sessions.create({
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
