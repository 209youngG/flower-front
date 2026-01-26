import { api } from "boot/axios";
import { z } from "zod";
import { generateIdempotencyKey } from "src/utils/idempotency";

// --- Zod Schemas ---

export const OrderItemSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  quantity: z.number(),
  price: z.number(),
  optionIds: z.array(z.number()).optional(),
});

export const OrderSchema = z.object({
  id: z.number(),
  orderNo: z.string(),
  totalAmount: z.number(),
  status: z.enum([
    "PENDING",
    "PAID",
    "PREPARING",
    "SHIPPING",
    "DELIVERED",
    "CANCELLED",
  ]),
  items: z.array(OrderItemSchema),
  createdAt: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;

export const CreateOrderRequestSchema = z.object({
  memberId: z.number(),
  isDirectOrder: z.boolean().optional().default(false),
  
  productId: z.number().optional(),
  quantity: z.number().optional(),
  optionIds: z.array(z.number()).optional(),

  deliveryMethod: z.enum(["PICKUP", "SHIPPING", "QUICK"]),
  reservedAt: z.string().optional(),
  messageCard: z.string().optional(),

  deliveryAddress: z.string().min(1),
  deliveryPhone: z.string().min(1),
  deliveryName: z.string().min(1),
  deliveryNote: z.string().optional(),
});
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

// --- API Functions ---

// 장바구니 주문
export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const idempotencyKey = generateIdempotencyKey();
  const response = await api.post("/api/v1/orders", data, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return OrderSchema.parse(response.data);
};

// 바로 구매
export const createDirectOrder = async (
  data: CreateOrderRequest
): Promise<Order> => {
  const idempotencyKey = generateIdempotencyKey();
  const response = await api.post("/api/v1/orders/direct", data, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return OrderSchema.parse(response.data);
};

export const getMyOrders = async (memberId: number): Promise<Order[]> => {
  const response = await api.get("/api/v1/orders/my", { params: { memberId } });
  return z.array(OrderSchema).parse(response.data);
};

export const getOrder = async (orderId: number): Promise<Order> => {
  const response = await api.get(`/api/v1/orders/${orderId}`);
  return OrderSchema.parse(response.data);
};

export const cancelOrder = async (orderId: number): Promise<void> => {
  await api.post(`/api/v1/orders/${orderId}/cancel`);
};
