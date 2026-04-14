import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "@/services/categories.service";

export const CATEGORIES_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: CategoriesService.list,
  });
}
