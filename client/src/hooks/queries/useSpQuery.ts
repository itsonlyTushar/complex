import { SP_KEYS } from "@/constants/queryFactory"
import { fetchFoodCourts } from "@/services/sp.service"
import { useQuery } from "@tanstack/react-query"

export const useGetFoodCourts = () => {
    return useQuery({
        queryKey: SP_KEYS.courts(),
        queryFn: fetchFoodCourts
    })
}
