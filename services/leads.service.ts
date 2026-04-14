import api from "@/lib/axios";
import type { Lead } from "@/types/leads.types";

export const LeadsService = {
  list: () => api.get<Lead[]>("/leads").then((r) => r.data),
};
