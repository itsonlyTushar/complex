import { TABLE_KEYS } from "@/constants/queryFactory"
import { getTables, getLayout } from "@/services/table.service"
import { useQuery } from "@tanstack/react-query"

export const useGetTables = () => {
    return useQuery({
        queryKey: TABLE_KEYS.table(),
        queryFn: getTables
    })
}

export const useGetLayout = () => {
    return useQuery({
        queryKey: TABLE_KEYS.layout(),
        queryFn: getLayout
    })
}

