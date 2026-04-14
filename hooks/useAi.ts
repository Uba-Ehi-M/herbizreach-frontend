import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AiService } from "@/services/ai.service";

export function useImproveDescription() {
  return useMutation({
    mutationFn: AiService.improveDescription,
    onError: () => toast.error("AI is unavailable. Try again later."),
  });
}
