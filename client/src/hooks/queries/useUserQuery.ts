import { fetchMe } from "@/services/user.service"
import { useQuery } from "@tanstack/react-query"

export const USER_KEYS = {
    me: () => ['me'],
}

export const useGetMe = () => {
    return useQuery({
        queryKey: USER_KEYS.me(),
        queryFn: fetchMe
    })
}