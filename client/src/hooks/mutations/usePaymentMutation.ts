import {
  connectRazorpay,
  createPaymentIntent,
  createRazorpayOrder,
  disconnectRazorpay,
  onboardRestaurant,
  verifyOnboarding,
  verifyRazorpayPayment,
} from "@/services/payment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useConnectRazorpay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectRazorpay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useDisconnectRazorpay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectRazorpay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: createRazorpayOrder,
  });
};

export const useVerifyRazorpayPayment = () => {
  return useMutation({
    mutationFn: verifyRazorpayPayment,
  });
};
