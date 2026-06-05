import { ORDER_KEYS } from "@/constants/queryFactory";
import { addOrder, cancelOrder, updateOrderStatus } from "@/services/order.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ORDER_KEYS.orders()})
    }
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ORDER_KEYS.orders()})
    }
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ORDER_KEYS.orders()})
    }
  })
}