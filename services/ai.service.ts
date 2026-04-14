import api from "@/lib/axios";

export interface ImproveDescriptionResult {
  description_ai: string;
  caption_ai: string;
}

export const AiService = {
  improveDescription: (body: { descriptionRaw: string; productName?: string }) =>
    api
      .post<ImproveDescriptionResult>("/ai/improve-description", body)
      .then((r) => r.data),
};
