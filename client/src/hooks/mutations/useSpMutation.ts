import { SP_KEYS } from "@/constants/queryFactory"
import { editFoodCourt, deleteFoodCourt, updateRestaurantCommission } from "@/services/sp.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useEditFoodCourt = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: editFoodCourt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SP_KEYS.courts() })
        }
    })
}

export const useDeleteFoodCourt = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteFoodCourt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SP_KEYS.courts() })
        }
    })
}

export const useUpdateRestaurantCommission = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateRestaurantCommission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SP_KEYS.restaurantsCommission() })
        }
    })
}
