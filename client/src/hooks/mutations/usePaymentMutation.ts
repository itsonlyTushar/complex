import { createPaymentIntent, onboardRestaurant, verifyOnboarding } from "@/services/payment.service";
import { useMutation } from "@tanstack/react-query";

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: createPaymentIntent,
  });
};

export const useOnboardRestaurant = () => {
  return useMutation({
    mutationFn: onboardRestaurant,
  });
};

export const useVerifyOnboarding = () => {
  return useMutation({
    mutationFn: verifyOnboarding,
  });
};
