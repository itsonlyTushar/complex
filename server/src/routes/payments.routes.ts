import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPaymentIntentController,
  onboardRestaurantStripeController,
  refundPaymentController,
  verifyOnboardingController,
  getRestaurantsCommissionController,
  updateRestaurantCommissionController,
} from "../controllers/payments/payments.controller.js";

const router = Router()

router.post('/onboard-restaurant', authMiddleware, onboardRestaurantStripeController)
router.post('/verify-onboarding', authMiddleware, verifyOnboardingController)
router.post('/create-payment', createPaymentIntentController)
router.post('/refund', authMiddleware, refundPaymentController)
router.get('/restaurants-commission', authMiddleware, getRestaurantsCommissionController)
router.patch('/restaurants-commission/:id', authMiddleware, updateRestaurantCommissionController)

export default router