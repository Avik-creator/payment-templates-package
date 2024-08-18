import Stripe from "stripe";
import { Request, Response } from "express";
import { Payment, PaymentStatus } from "../models/Stripe";
const STRIPE = new Stripe(process.env.STRIPE_SECRET_KEY!);
const FRONTEND_URL = process.env.FRONTEND_URL!;

// Create a new checkout session
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { amount, currency, metadata } = req.body;

    const session = await STRIPE.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Your Product Name",
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment-cancelled`,
      metadata: metadata,
    });

    // Create a new Payment document
    const payment = new Payment({
      method: "stripe",
      amount: amount,
      currency: currency,
      transactionId: session.id,
      status: PaymentStatus.Pending,
      metadata: metadata,
    });

    await payment.save();

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

// Handle Stripe webhooks
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  try {
    const event = STRIPE.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await updatePaymentStatus(session.id, PaymentStatus.Completed);
        break;
      case "charge.failed":
        const charge = event.data.object as Stripe.Charge;
        await updatePaymentStatus(
          charge.payment_intent as string,
          PaymentStatus.Failed
        );
        break;
      // Add more cases as needed
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Update the payment status in the database
async function updatePaymentStatus(
  transactionId: string,
  status: PaymentStatus
) {
  await Payment.findOneAndUpdate(
    { transactionId: transactionId },
    { status: status },
    { new: true }
  );
}
