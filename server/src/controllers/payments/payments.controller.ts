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
import type { RazorpayCheckoutPayload } from "../../types/payment.types.js";

export const onboardRestaurantStripeController = async (req: Request, res: Response) => {
  try {
    const restaurantId = (req as any).user?.restaurantId || (req.body.restaurantId || req.query.restaurantId) as string;

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
    const restaurantId = (req as any).user?.restaurantId;

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
    const restaurantId = (req as any).user?.restaurantId;
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
    const restaurantId = (req as any).user?.restaurantId;

    if (!restaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }

    const restaurant = await disconnectRazorpay(restaurantId);
    res.status(200).json({ message: "Razorpay disconnected.", restaurant });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to disconnect Razorpay." });
  }
};

const parseCheckoutPayload = (body: any): RazorpayCheckoutPayload => {
  const { restaurantId, items, customerName, tableNumber } = body;

  if (typeof restaurantId !== "string" || !restaurantId) {
    throw new Error("Restaurant ID is required.");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty.");
  }
  if (typeof customerName !== "string" || !customerName.trim()) {
    throw new Error("Customer name is required.");
  }
  if (!Number.isInteger(tableNumber) || tableNumber <= 0) {
    throw new Error("A valid table number is required.");
  }

  return {
    restaurantId,
    items: items.map((item: any) => ({ menuID: Number(item?.menuID), quantity: Number(item?.quantity) })),
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
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (![razorpayOrderId, razorpayPaymentId, razorpaySignature].every((value) => typeof value === "string" && value)) {
      return res.status(400).json({ error: "Payment details are missing." });
    }

    const order = await verifyRazorpayPayment({
      ...parseCheckoutPayload(req.body),
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
    const userRole = (req as any).user?.role;
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
    const userRole = (req as any).user?.role;
    if (userRole !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Access denied. Super Admin privileges required." });
    }

    const { id } = req.params;
    const { commissionRate } = req.body;

    if (commissionRate === undefined || isNaN(Number(commissionRate))) {
      return res.status(400).json({ error: "Valid commissionRate is required." });
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