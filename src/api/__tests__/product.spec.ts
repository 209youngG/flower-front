import { describe, it, expect } from "vitest";
import { ProductSchema, ProductOptionSchema } from "../product";

describe("Product API Schemas", () => {
  describe("ProductOptionSchema", () => {
    it("should validate a valid option", () => {
      const validOption = {
        id: 1,
        name: "Size",
        optionValue: "Large",
        priceAdjustment: 5000,
      };
      const result = ProductOptionSchema.safeParse(validOption);
      expect(result.success).toBe(true);
    });

    it("should fail validation if required fields are missing", () => {
      const invalidOption = {
        name: "Size", // Missing id, optionValue, priceAdjustment
      };
      const result = ProductOptionSchema.safeParse(invalidOption);
      expect(result.success).toBe(false);
    });
  });

  describe("ProductSchema", () => {
    it("should validate a valid product", () => {
      const validProduct = {
        id: 100,
        name: "Red Rose Bouquet",
        price: 35000,
        stockQuantity: 50,
        description: "Beautiful roses",
        options: [],
        reviewCount: 0,
        totalRating: 0,
        averageRating: 0,
      };
      const result = ProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it("should validate a product with optional fields", () => {
      const validProduct = {
        id: 101,
        name: "Tulip",
        price: 15000,
        stockQuantity: 10,
        discountPrice: 12000,
        thumbnailUrl: "http://example.com/img.jpg",
        isActive: true,
        options: [],
      };
      const result = ProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it("should reject invalid types", () => {
      const invalidProduct = {
        id: "not-a-number", // Error
        name: 123, // Error
        price: "expensive", // Error
        stockQuantity: -1, // Zod doesn't catch negative unless .min(0) is used, but types must match
      };
      const result = ProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });
});
