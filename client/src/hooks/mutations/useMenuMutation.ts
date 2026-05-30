import { MENU_KEYS } from "@/constants/queryFactory";
import { addCategory, updateCategory } from "@/services/menu.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.categories() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_KEYS.categories() });
    },
  });
};
