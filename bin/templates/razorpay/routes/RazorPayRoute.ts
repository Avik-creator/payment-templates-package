import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
} from "../controller/RazorPayController";
import { protectRoute } from "../middlewares/protectRoute";

const router = express.Router();
router.post(
  "/checkout/razorpay/create-order",
  protectRoute,
  createRazorpayOrder
);
router.post("/checkout/razorpay/webhook", handleRazorpayWebhook);

router.post("/checkout/razorpay/verfiy-signature", verifyRazorpayPayment);

export default router;
