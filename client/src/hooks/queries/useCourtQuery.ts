import { fetchRestaurants } from "@/services/court.service"
import { useQuery } from "@tanstack/react-query"


export const COURT_KEYS = {
    restaurants: () => ['restaurants'],
}

export const useGetRestaurants = () => {
    return useQuery({
        queryKey: COURT_KEYS.restaurants(),
        queryFn: fetchRestaurants
        })
}