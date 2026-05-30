import { MENU_KEYS } from "@/constants/queryFactory"
import { fetchCategories, fetchMenus } from "@/services/menu.service"
import { useQuery } from "@tanstack/react-query"

export const useGetCategories = () => {
    return useQuery({
        queryKey: MENU_KEYS.categories(),
        queryFn: fetchCategories
    })
}

export const useGetMenus = () => {
    return useQuery({
        queryKey: MENU_KEYS.menus(),
        queryFn: fetchMenus
    })
}

