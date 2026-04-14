import api from "@/lib/axios";
import type { Category } from "@/types/store.types";

export const CategoriesService = {
  list: () => api.get<Category[]>("/categories").then((r) => r.data),
};
