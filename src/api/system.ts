import { api } from "boot/axios";
import { z } from "zod";

// --- Zod Schemas ---

export const CodeItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  order: z.number().optional(),
});
export type CodeItem = z.infer<typeof CodeItemSchema>;

export const SystemCodesSchema = z.object({
  category: z.array(CodeItemSchema),
  deliveryType: z.array(CodeItemSchema),
  // Add other code groups here
});
export type SystemCodes = z.infer<typeof SystemCodesSchema>;

// --- API Functions ---

export const getSystemCodes = async (): Promise<SystemCodes> => {
  // 실제 엔드포인트는 백엔드 스펙에 따라 달라질 수 있음
  // 여기서는 '/api/v1/system/codes'로 가정
  const response = await api.get("/api/v1/system/codes");
  return SystemCodesSchema.parse(response.data);
};
