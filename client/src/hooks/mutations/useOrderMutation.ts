import { addOrder } from "@/services/order.service";
import { useMutation } from "@tanstack/react-query";

export const useAddOrder = () => {
  return useMutation({
    mutationFn: addOrder,
  });
};
