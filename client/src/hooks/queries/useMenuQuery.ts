import { fetchCategories, addCategory } from "@/services/menu.service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const MENU_KEYS = {
    categories: () => ['categories'],
}

export const useGetCategories = () => {
    return useQuery({
        queryKey: MENU_KEYS.categories(),
        queryFn: fetchCategories
    })
}

export const useAddCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MENU_KEYS.categories() });
        }
    })
}
