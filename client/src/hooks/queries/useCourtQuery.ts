import { fetchRestaurants, fetchPublicRestaurantDetails } from "@/services/court.service"
import { useQuery } from "@tanstack/react-query"


export const COURT_KEYS = {
    restaurants: () => ['restaurants'],
    restaurantDetails: (id?: string) => ['restaurantDetails', id],
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