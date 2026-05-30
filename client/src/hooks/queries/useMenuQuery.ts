import { MENU_KEYS } from "@/constants/queryFactory"
import { fetchCategories } from "@/services/menu.service"
import { useQuery } from "@tanstack/react-query"

export const useGetCategories = () => {
    return useQuery({
        queryKey: MENU_KEYS.categories(),
        queryFn: fetchCategories
    })
}

