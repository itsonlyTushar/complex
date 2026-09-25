import { ORDER_KEYS, PAYMENT_KEYS } from "@/constants/queryFactory"
import { fetchOrders, fetchPaymentDetails } from "@/services/order.service"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

type OrdersResponse = Awaited<ReturnType<typeof fetchOrders>>

export const useGetOrders = (
    params?: { restaurantId?: string; tableNumber?: number },
    options?: Pick<UseQueryOptions<OrdersResponse>, "refetchInterval">
) => {
    return useQuery({
        queryKey: ORDER_KEYS.orders(params),
        queryFn: () => fetchOrders(params),
        enabled: params ? (!!params.restaurantId && params.tableNumber !== undefined) : true,
        ...options
    })
}

export const useGetPaymentDetails = () => {
    return useQuery({
        queryKey: PAYMENT_KEYS.details(),
        queryFn: fetchPaymentDetails,
    })
}
