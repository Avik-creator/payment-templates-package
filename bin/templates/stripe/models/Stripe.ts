import { Schema, model, Document } from "mongoose";

export enum PaymentStatus {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
  Refunded = "Refunded",
}

export interface PaymentDocument extends Document {
  method: string;
  amount: number;
  currency: string;
  transactionId: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    method: {
      type: String,
      required: true,
      enum: ["razorpay", "stripe", "paypal", "other"], // Customize based on your payment methods
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

export const Payment = model<PaymentDocument>("Payment", PaymentSchema);
