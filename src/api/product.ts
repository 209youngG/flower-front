import { api } from "boot/axios";
import { z } from "zod";
import { PageRequest, PageResponse } from "./types";

// --- Zod Schemas ---

export const ProductOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  optionValue: z.string(),
  priceAdjustment: z.number(),
});
export type ProductOption = z.infer<typeof ProductOptionSchema>;

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  stockQuantity: z.number(),
  thumbnailUrl: z.string().nullable().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  isAvailableToday: z.boolean().optional(),
  deliveryType: z.string().optional(),
  options: z.array(ProductOptionSchema).optional().default([]),
  reviewCount: z.number().nullable().optional(),
  totalRating: z.number().nullable().optional(),
  averageRating: z.number().nullable().optional(),
});
export type Product = z.infer<typeof ProductSchema>;

// UI Extension (not from API, but useful to export)
export type ProductWithUI = Product & { uiQuantity: number };

export const ProductAddonSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});
export type ProductAddon = z.infer<typeof ProductAddonSchema>;

// --- API Functions ---

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/api/v1/products");
  return z.array(ProductSchema).parse(response.data);
};

// Admin / Infinite Scroll Support
export const getProductsPaged = async (
  params: PageRequest
): Promise<PageResponse<Product>> => {
  const response = await api.get("/api/v1/products", { params });
  // Assuming backend returns PageResponse structure. If not, simple array needs mapping.
  // For now, let's assume strict structure.
  // If backend returns Array for /products but Page for /products/paged, adjust URL.
  // Ideally, use a different endpoint or param if the same endpoint behaves differently.

  // Checking if response is array (legacy) or page (new)
  if (Array.isArray(response.data)) {
    // Fallback wrapper for legacy backend
    const content = z.array(ProductSchema).parse(response.data);
    return {
      content,
      totalPages: 1,
      totalElements: content.length,
      last: true,
      size: content.length,
      number: 0,
      first: true,
      empty: content.length === 0,
    };
  }

  return response.data as PageResponse<Product>;
};

export const getProduct = async (productId: number): Promise<Product> => {
  const response = await api.get(`/api/v1/products/${productId}`);
  return ProductSchema.parse(response.data);
};

export const getProductOptions = async (
  productId: number
): Promise<ProductOption[]> => {
  const response = await api.get(`/api/v1/products/${productId}/options`);
  return z.array(ProductOptionSchema).parse(response.data);
};

export const getAddons = async (): Promise<ProductAddon[]> => {
  const response = await api.get("/api/v1/products/addons");
  return z.array(ProductAddonSchema).parse(response.data);
};

export const restockProduct = async (
  productId: number,
  quantity: number
): Promise<void> => {
  await api.post(`/api/v1/products/${productId}/restock`, { quantity });
};

// Request DTOs
export const CreateProductSchema = z.object({
  name: z.string().min(1),
  productCode: z.string().min(1),
  price: z.number().min(0),
  stockQuantity: z.number().min(0),
  description: z.string().optional(),
  category: z.enum(["FLOWER_BOUQUET", "PLANT", "WREATH", "ORCHID", "BASKET"]),
  deliveryType: z.enum(["QUICK", "PARCEL", "MIXED"]),
  thumbnailUrl: z.string().optional(),
  options: z.array(
    z.object({
      name: z.string(),
      optionValue: z.string(),
      priceAdjustment: z.number(),
    })
  ).optional(),
});
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  const response = await api.post("/api/v1/products", data);
  return ProductSchema.parse(response.data);
};

export const updateProduct = async (
  productId: number,
  data: Partial<CreateProductRequest>
): Promise<Product> => {
  const response = await api.put(`/api/v1/products/${productId}`, data);
  return ProductSchema.parse(response.data);
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete(`/api/v1/products/${productId}`);
};
