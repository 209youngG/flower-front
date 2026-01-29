import { describe, it, expect } from "vitest";
import { CreateStoreSchema, StoreSchema, StoreWithDistanceSchema } from "../store";

describe("Store API Schemas", () => {
  describe("CreateStoreSchema", () => {
    it("should validate a valid store creation request", () => {
      const validData = {
        name: "강남 플라워",
        address: "서울시 강남구 테헤란로 123",
        phone: "02-1234-5678",
        lat: 37.4979,
        lon: 127.0276,
        description: "강남역 10번 출구 근처의 아름다운 꽃집입니다. 10자 이상의 설명.",
        openTime: "09:00",
        closeTime: "22:00",
        closedDays: ["Sunday"]
      };
      const result = CreateStoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail validation if description is too short", () => {
      const invalidData = {
        name: "Short Desc",
        address: "Address",
        phone: "010-0000-0000",
        lat: 37,
        lon: 127,
        description: "Too short",
        openTime: "09:00",
        closeTime: "22:00"
      };
      const result = CreateStoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("매장 설명을 10자 이상 입력해주세요");
      }
    });

    it("should fail validation for invalid time format", () => {
      const invalidData = {
        name: "Invalid Time",
        address: "Address",
        phone: "010-0000-0000",
        lat: 37.4,
        lon: 127.1,
        description: "Valid description more than 10 chars",
        openTime: "9:00", // Missing leading zero
        closeTime: "25:00" // Invalid hour
      };
      const result = CreateStoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("StoreSchema", () => {
    it("should validate a valid store response", () => {
      const validStore = {
        id: 1,
        name: "명동 꽃집",
        address: "서울시 중구 명동길 45",
        phone: "02-987-6543",
        lat: 37.5635,
        lon: 126.9843,
        description: "명동의 중심에 있는 플라워 샵",
        openTime: "10:00",
        closeTime: "21:00",
        closedDays: []
      };
      const result = StoreSchema.safeParse(validStore);
      expect(result.success).toBe(true);
    });
  });

  describe("StoreWithDistanceSchema", () => {
    it("should validate a store with distance", () => {
      const validStore = {
        id: 2,
        name: "홍대 플라워",
        address: "서울시 마포구 와우산로",
        phone: "02-111-2222",
        lat: 37.5567,
        lon: 126.9234,
        description: "홍대 근처 힙한 꽃집",
        openTime: "11:00",
        closeTime: "23:00",
        closedDays: ["Monday"],
        distance: 1.2
      };
      const result = StoreWithDistanceSchema.safeParse(validStore);
      expect(result.success).toBe(true);
    });
  });
});
