import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { razorpayInstance } from "../utils/RazorpayInstance";
import { Payment, PaymentStatus } from "../models/RazorPay"; // Adjust the import path as needed

const FRONTEND_URL = process.env.FRONTEND_URL!;

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency, metadata } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: metadata,
    };

    const order = await razorpayInstance.orders.create(options);

    // Create a new Payment document
    const payment = new Payment({
      method: "razorpay",
      amount: amount,
      currency: currency,
      transactionId: order.id,
      status: PaymentStatus.Pending,
      metadata: metadata,
    });

    await payment.save();

    res.json({ orderId: order.id, ...order });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment is successful
      await updatePaymentStatus(razorpay_order_id, PaymentStatus.Completed);
      res.redirect(`${FRONTEND_URL}/payment-success`);
    } else {
      // Payment verification failed
      await updatePaymentStatus(razorpay_order_id, PaymentStatus.Failed);
      res.redirect(`${FRONTEND_URL}/payment-failed`);
    }
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: error.message });
  }
};

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers["x-razorpay-signature"] as string;

  try {
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
      const event = req.body;

      switch (event.event) {
        case "payment.captured":
          await updatePaymentStatus(
            event.payload.payment.entity.order_id,
            PaymentStatus.Completed
          );
          break;
        case "payment.failed":
          await updatePaymentStatus(
            event.payload.payment.entity.order_id,
            PaymentStatus.Failed
          );
          break;
        // Add more cases as needed
      }

      res.json({ status: "ok" });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

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

// Helper function to retrieve payment details
export const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const payment = await Payment.findOne({ transactionId: transactionId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error: any) {
    console.error("Error retrieving payment details:", error);
    res.status(500).json({ error: error.message });
  }
};
