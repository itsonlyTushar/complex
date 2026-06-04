import type { Request, Response } from "express";
import {
  onboardRestaurantStripe,
  createPaymentIntent,
  refundPayment,
  verifyRestaurantOnboarding,
} from "../../services/payment.service.js";

export const onboardRestaurantStripeController = async (req: Request, res: Response) => {
  try {
    const restaurantId = (req as any).user?.restaurantId || Number(req.body.restaurantId || req.query.restaurantId);

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    const onboardingData = await onboardRestaurantStripe(Number(restaurantId));

    res.status(200).json({
      message: "Stripe onboarding URL generated successfully.",
      ...onboardingData,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to onboard Stripe." });
  }
};

export const verifyOnboardingController = async (req: Request, res: Response) => {
  try {
    const restaurantId = (req as any).user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    const verification = await verifyRestaurantOnboarding(Number(restaurantId));

    res.status(200).json({
      message: "Stripe onboarding verified successfully.",
      ...verification,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to verify Stripe onboarding." });
  }
};

export const createPaymentIntentController = async (req: Request, res: Response) => {
  try {
    const { amount, currency, commissionAmount, application_fee_amount, orderId, restaurantId } = req.body;

    const resolvedRestaurantId = restaurantId || (req as any).user?.restaurantId;

    if (!resolvedRestaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    const paymentData = {
      amount,
      currency,
      commissionAmount,
      application_fee_amount,
      orderId,
    };

    const paymentIntent = await createPaymentIntent(paymentData, resolvedRestaurantId);

    res.status(200).json({
      message: "Payment intent created successfully.",
      paymentIntent,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to create payment intent." });
  }
};

export const refundPaymentController = async (req: Request, res: Response) => {
  try {
    const { orderId, restaurantId } = req.body;

    const resolvedRestaurantId = restaurantId || (req as any).user?.restaurantId;

    if (!resolvedRestaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const refund = await refundPayment(resolvedRestaurantId, orderId);

    res.status(200).json({
      message: "Payment refunded successfully.",
      refund,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to refund payment." });
  }
};
