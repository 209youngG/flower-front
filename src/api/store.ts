import { api } from "boot/axios";
import { z } from "zod";

// --- Zod Schemas & Types ---

export const CreateStoreSchema = z.object({
  name: z.string().min(1, "매장명을 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
  lat: z.number({ required_error: "위치를 선택해주세요" }),
  lon: z.number({ required_error: "위치를 선택해주세요" }),
  description: z.string().min(10, "매장 설명을 10자 이상 입력해주세요"),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "올바른 시간 형식이 아닙니다 (HH:mm)"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "올바른 시간 형식이 아닙니다 (HH:mm)"),
  closedDays: z.array(z.string()).default([]),
});

export type CreateStoreRequest = z.infer<typeof CreateStoreSchema>;

export const StoreSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  lat: z.number(),
  lon: z.number(),
  description: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  closedDays: z.array(z.string()),
});

export const StoreWithDistanceSchema = StoreSchema.extend({
  distance: z.number().optional(),
});

export type Store = z.infer<typeof StoreSchema>;
export type StoreWithDistance = z.infer<typeof StoreWithDistanceSchema>;

// --- API Functions ---

export const getNearbyStores = async (
  lat: number,
  lon: number,
  radiusKm: number,
  keyword?: string
): Promise<StoreWithDistance[]> => {
  const params = { lat, lon, radiusKm, keyword };
  const response = await api.get("/api/v1/stores/nearby", { params });
  return z.array(StoreWithDistanceSchema).parse(response.data);
};

export const createStore = async (data: CreateStoreRequest): Promise<Store> => {
  const response = await api.post("/api/v1/stores", data);
  // Assuming the server returns the created store. 
  // If the server returns ApiResponse wrapper, we might need to adjust, 
  // but following auth.ts pattern:
  return StoreSchema.parse(response.data);
};

export const getStore = async (storeId: number): Promise<Store> => {
  const response = await api.get(`/api/v1/stores/${storeId}`);
  return StoreSchema.parse(response.data);
};
