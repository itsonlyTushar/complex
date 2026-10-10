import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";
import {
  createPaymentIntentController,
  onboardRestaurantStripeController,
  refundPaymentController,
  verifyOnboardingController,
  getRestaurantsCommissionController,
  updateRestaurantCommissionController,
  connectRazorpayController,
  disconnectRazorpayController,
  createRazorpayOrderController,
  verifyRazorpayPaymentController,
} from "../controllers/payments/payments.controller.js";

const router = Router()

router.post('/onboard-restaurant', authMiddleware, requireRole("RESTAURANT_VENDOR"), onboardRestaurantStripeController)
router.post('/verify-onboarding', authMiddleware, requireRole("RESTAURANT_VENDOR"), verifyOnboardingController)
router.post('/create-payment', createPaymentIntentController)
router.post('/refund', authMiddleware, requireRole("RESTAURANT_VENDOR"), refundPaymentController)
router.post('/razorpay/connect', authMiddleware, requireRole("RESTAURANT_VENDOR"), connectRazorpayController)
router.delete('/razorpay/connect', authMiddleware, requireRole("RESTAURANT_VENDOR"), disconnectRazorpayController)
router.post('/razorpay/order', createRazorpayOrderController)
router.post('/razorpay/verify', verifyRazorpayPaymentController)
router.get('/restaurants-commission', authMiddleware, requireRole("SUPER_ADMIN"), getRestaurantsCommissionController)
router.patch('/restaurants-commission/:id', authMiddleware, requireRole("SUPER_ADMIN"), updateRestaurantCommissionController)

export default router