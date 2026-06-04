import { MENU_KEYS } from "@/constants/queryFactory"
import { fetchCategories, fetchMenus } from "@/services/menu.service"
import { useQuery } from "@tanstack/react-query"

export const useGetCategories = () => {
    return useQuery({
        queryKey: MENU_KEYS.categories(),
        queryFn: fetchCategories
    })
}

export const useGetMenus = (restaurantId?: string) => {
    return useQuery({
        queryKey: MENU_KEYS.menus(restaurantId),
        queryFn: () => fetchMenus(restaurantId)
    })
}

