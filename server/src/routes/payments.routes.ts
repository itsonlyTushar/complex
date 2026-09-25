import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
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

router.post('/onboard-restaurant', authMiddleware, onboardRestaurantStripeController)
router.post('/verify-onboarding', authMiddleware, verifyOnboardingController)
router.post('/create-payment', createPaymentIntentController)
router.post('/refund', authMiddleware, refundPaymentController)
router.post('/razorpay/connect', authMiddleware, connectRazorpayController)
router.delete('/razorpay/connect', authMiddleware, disconnectRazorpayController)
router.post('/razorpay/order', createRazorpayOrderController)
router.post('/razorpay/verify', verifyRazorpayPaymentController)
router.get('/restaurants-commission', authMiddleware, getRestaurantsCommissionController)
router.patch('/restaurants-commission/:id', authMiddleware, updateRestaurantCommissionController)

export default router