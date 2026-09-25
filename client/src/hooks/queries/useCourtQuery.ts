import { fetchRestaurants, fetchPublicRestaurantDetails, fetchPublicFoodCourt } from "@/services/court.service"
import { useQuery } from "@tanstack/react-query"
import { useGetMe } from "./useUserQuery"


export const COURT_KEYS = {
    restaurants: () => ['restaurants'],
    restaurantDetails: (id?: string) => ['restaurantDetails', id],
    publicFoodCourt: (id?: string, tableId?: string | null) => ['publicFoodCourt', id, tableId],
}

export const useGetRestaurants = () => {
    return useQuery({
        queryKey: COURT_KEYS.restaurants(),
        queryFn: fetchRestaurants
        })
}

export const useGetRestaurantDetails = (restaurantId?: string) => {
    return useQuery({
        queryKey: COURT_KEYS.restaurantDetails(restaurantId),
        queryFn: () => fetchPublicRestaurantDetails(restaurantId!),
        enabled: !!restaurantId
    })
}

export const useGetPublicFoodCourt = (foodCourtId?: string, tableId?: string | null) => {
    return useQuery({
        queryKey: COURT_KEYS.publicFoodCourt(foodCourtId, tableId),
        queryFn: () => fetchPublicFoodCourt(foodCourtId!, tableId),
        enabled: !!foodCourtId,
        // A wrong table or court is a 400 that retrying won't fix; show it straight away.
        retry: false
    })
}

export const useCourt = () => {
    const { data: user, isLoading, error } = useGetMe()
    return {
        foodCourtId: user?.foodCourtId as string | undefined,
        isLoading,
        error
    }
}
