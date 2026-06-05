import { ORDER_KEYS, PAYMENT_KEYS } from "@/constants/queryFactory"
import { fetchOrders, fetchPaymentDetails } from "@/services/order.service"
import { useQuery } from "@tanstack/react-query"

export const useGetOrders = (params?: { restaurantId?: string; tableNumber?: number }) => {
    return useQuery({
        queryKey: ORDER_KEYS.orders(params),
        queryFn: () => fetchOrders(params),
        enabled: params ? (!!params.restaurantId && params.tableNumber !== undefined) : true
    })
}

export const useGetPaymentDetails = () => {
    return useQuery({
        queryKey: PAYMENT_KEYS.details(),
        queryFn: fetchPaymentDetails,
    })
}
