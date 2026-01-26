import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import {
  login,
  register,
  type User,
  type LoginRequest,
  type RegisterRequest,
} from "src/api/auth";

interface UserState {
  user: User | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: LocalStorage.getItem<User>("user") || null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    memberId: (state): number | undefined => state.user?.id,
    role: (state) => state.user?.role,

    isAdmin: (state): boolean => {
      const adminRoles = ["ROOT_ADMIN", "PRODUCT_ADMIN", "DELIVERY_ADMIN"];
      return !!state.user?.role && adminRoles.includes(state.user.role);
    },
  },

  actions: {
    async login(creds: LoginRequest): Promise<boolean> {
      try {
        const user = await login(creds);
        this.user = user;
        LocalStorage.set("user", this.user);
        return true;
      } catch (error) {
        console.error("Login failed", error);
        throw error;
      }
    },

    async register(data: RegisterRequest): Promise<boolean> {
      try {
        const user = await register(data);
        this.user = user;
        LocalStorage.set("user", this.user);
        return true;
      } catch (error) {
        console.error("Registration failed", error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      LocalStorage.remove("user");
    },
  },
});
