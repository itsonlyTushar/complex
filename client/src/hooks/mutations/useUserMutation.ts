
import { USER_KEYS } from "@/constants/queryFactory"
import { uploadLogo, updateRestaurantStatus } from "@/services/user.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUploadLogo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: uploadLogo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.logo() })
            queryClient.invalidateQueries({ queryKey: ['me'] })
        }
    })
}

export const useUpdateRestaurantStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateRestaurantStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] })
            queryClient.invalidateQueries({ queryKey: ['restaurants'] })
        }
    })
}