import { SP_KEYS } from "@/constants/queryFactory"
import { editFoodCourt, deleteFoodCourt } from "@/services/sp.service"
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
