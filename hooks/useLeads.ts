import { useQuery } from "@tanstack/react-query";
import { LeadsService } from "@/services/leads.service";

export const LEADS_KEY = ["leads"] as const;

export function useLeads() {
  return useQuery({
    queryKey: LEADS_KEY,
    queryFn: LeadsService.list,
  });
}
