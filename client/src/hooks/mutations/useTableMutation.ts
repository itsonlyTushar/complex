import { TABLE_KEYS } from "@/constants/queryFactory";
import { addTable } from "@/services/table.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TABLE_KEYS.table() });
    },
  });
};
