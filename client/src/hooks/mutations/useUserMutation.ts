
import { USER_KEYS } from "@/constants/queryFactory"
import { uploadLogo } from "@/services/user.service"
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