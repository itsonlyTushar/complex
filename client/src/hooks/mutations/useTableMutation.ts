import { TABLE_KEYS } from "@/constants/queryFactory";
import { addTable, saveLayout } from "@/services/table.service";
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

export const useSaveLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TABLE_KEYS.layout() });
      queryClient.invalidateQueries({ queryKey: TABLE_KEYS.table() });
    },
  });
};

