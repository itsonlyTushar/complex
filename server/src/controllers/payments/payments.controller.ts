import type { Request, Response } from "express";
import {
  onboardRestaurantStripe,
  createPaymentIntent,
  refundPayment,
  verifyRestaurantOnboarding,
  handleStripeWebhook,
  getRestaurantsCommission,
  updateRestaurantCommission,
} from "../../services/payment.service.js";
import {
  connectRazorpay,
  disconnectRazorpay,
  createRazorpayCheckout,
  verifyRazorpayPayment,
} from "../../services/razorpay.service.js";
import type { CreatePaymentIntentPayload, RazorpayCheckoutPayload } from "../../types/payment.types.js";
import { parseCartLines } from "../../services/pricing.service.js";

export const onboardRestaurantStripeController = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    const onboardingData = await onboardRestaurantStripe(restaurantId);

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
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    const verification = await verifyRestaurantOnboarding(restaurantId);

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
    const body = req.body as Partial<CreatePaymentIntentPayload> | null;
    if (typeof body?.restaurantId !== "string" || !body.restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    const items = parseCartLines(body.items);
    const paymentIntent = await createPaymentIntent(body.restaurantId, items);

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
    const { orderId } = req.body ?? {};
    const resolvedRestaurantId = req.user?.restaurantId;

    if (!resolvedRestaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }

    if (!Number.isSafeInteger(orderId)) {
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

export const stripeWebhookController = async (req: Request, res: Response) => {
      const sign = req.headers["stripe-signature"]

    if(!sign) {
      return res.status(400).send("Webhook Error: missing stripe sign")
    }

  try {
    await handleStripeWebhook(req.body, sign as string)
    res.status(200).json({received: true})
  } catch (error: any) {
    res.status(400).send({error: error.message})
  }
}

export const connectRazorpayController = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.user?.restaurantId;
    const { keyId, keySecret } = req.body;

    if (!restaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }

    if (typeof keyId !== "string" || !/^rzp_(test|live)_/.test(keyId.trim())) {
      return res.status(400).json({ error: "Key ID should start with rzp_test_ or rzp_live_." });
    }

    if (typeof keySecret !== "string" || !keySecret.trim()) {
      return res.status(400).json({ error: "Key Secret is required." });
    }

    const restaurant = await connectRazorpay(restaurantId, keyId.trim(), keySecret.trim());
    res.status(200).json({ message: "Razorpay connected successfully.", restaurant });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to connect Razorpay." });
  }
};

export const disconnectRazorpayController = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }

    const restaurant = await disconnectRazorpay(restaurantId);
    res.status(200).json({ message: "Razorpay disconnected.", restaurant });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to disconnect Razorpay." });
  }
};

const parseCheckoutDetails = (body: unknown) => {
  if (!body || typeof body !== "object") {
    throw new Error("Checkout details are required.");
  }
  const { restaurantId, items, customerName, tableNumber } = body as Record<string, unknown>;
  if (typeof restaurantId !== "string" || !restaurantId) {
    throw new Error("Restaurant ID is required.");
  }
  return { restaurantId, items, customerName, tableNumber };
};

const parseCheckoutPayload = (body: unknown): RazorpayCheckoutPayload => {
  const { restaurantId, items, customerName, tableNumber } = parseCheckoutDetails(body);
  if (typeof customerName !== "string" || !customerName.trim()) {
    throw new Error("Customer name is required.");
  }
  if (typeof tableNumber !== "number" || !Number.isSafeInteger(tableNumber) || tableNumber <= 0) {
    throw new Error("A valid table number is required.");
  }

  return {
    restaurantId,
    items: parseCartLines(items),
    customerName: customerName.trim(),
    tableNumber,
  };
};

export const createRazorpayOrderController = async (req: Request, res: Response) => {
  try {
    const checkout = await createRazorpayCheckout(parseCheckoutPayload(req.body));
    res.status(200).json(checkout);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to start Razorpay checkout." });
  }
};

export const verifyRazorpayPaymentController = async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body ?? {};

    if (![razorpayOrderId, razorpayPaymentId, razorpaySignature].every((value) => typeof value === "string" && value)) {
      return res.status(400).json({ error: "Payment details are missing." });
    }

    const order = await verifyRazorpayPayment({
      ...parseCheckoutDetails(req.body),
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    res.status(201).json({ message: "Payment verified and order placed.", order });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to verify payment." });
  }
};

export const getRestaurantsCommissionController = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Access denied. Super Admin privileges required." });
    }

    const rates = await getRestaurantsCommission();
    res.status(200).json(rates);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to fetch restaurant commission rates." });
  }
};

export const updateRestaurantCommissionController = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Access denied. Super Admin privileges required." });
    }

    const { id } = req.params;
    const { commissionRate } = req.body;

    if (!Number.isFinite(Number(commissionRate)) || Number(commissionRate) < 0 || Number(commissionRate) > 100) {
      return res.status(400).json({ error: "Commission rate must be between 0 and 100." });
    }

    const updated = await updateRestaurantCommission(id as string, Number(commissionRate));
    res.status(200).json({
      message: "Restaurant commission rate updated successfully.",
      restaurant: updated,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to update restaurant commission rate." });
  }
};