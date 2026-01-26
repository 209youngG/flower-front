import { api } from "boot/axios";
import { z } from "zod";

// --- 1. Zod Schemas & Types ---

export const UserRoleSchema = z.enum([
  "ROOT_ADMIN",
  "PRODUCT_ADMIN",
  "DELIVERY_ADMIN",
  "USER",
  "GUEST",
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.number(),
  loginId: z.string(),
  name: z.string(),
  role: UserRoleSchema,
  email: z.string().email().optional(),
  phone: z.string().optional(),
  token: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

// API Request DTOs
export const LoginRequestSchema = z.object({
  loginId: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  loginId: z.string().min(4, "아이디는 4자 이상이어야 합니다"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이 아닙니다").optional(),
  phone: z.string().optional(),
  // 필요 시 추가 필드 정의
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// --- 2. API Functions ---

export const login = async (creds: LoginRequest): Promise<User> => {
  const response = await api.post("/api/v1/members/login", creds);
  // Runtime Validation: 서버 응답이 UserSchema와 일치하는지 검증
  return UserSchema.parse(response.data);
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post("/api/v1/members/register", data);
  return UserSchema.parse(response.data);
};
