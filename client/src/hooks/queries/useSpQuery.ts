import { SP_KEYS } from "@/constants/queryFactory"
import { fetchFoodCourts, fetchRestaurantsCommission } from "@/services/sp.service"
import { useQuery } from "@tanstack/react-query"

export const useGetFoodCourts = () => {
    return useQuery({
        queryKey: SP_KEYS.courts(),
        queryFn: fetchFoodCourts
    })
}

export const useGetRestaurantsCommission = () => {
    return useQuery({
        queryKey: SP_KEYS.restaurantsCommission(),
        queryFn: fetchRestaurantsCommission
    })
}
