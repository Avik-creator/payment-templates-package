import express from "express";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controller/StripeController";
import { protectRoute } from "../middlewares/protectRoute";

const router = express.Router();
router.post(
  "/checkout/stripe/create-checkout-session",
  protectRoute,
  createCheckoutSession
);
router.post("/checkout/webhook", handleWebhook);

export default router;
