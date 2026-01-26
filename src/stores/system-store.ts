import { defineStore } from "pinia";
import {
  getSystemCodes,
  type SystemCodes,
  type CodeItem,
} from "src/api/system";

interface SystemState {
  codes: SystemCodes | null;
  loading: boolean;
}

export const useSystemStore = defineStore("system", {
  state: (): SystemState => ({
    codes: null,
    loading: false,
  }),

  getters: {
    categoryOptions: (state): CodeItem[] => state.codes?.category || [],
    deliveryOptions: (state): CodeItem[] => state.codes?.deliveryType || [],

    // Helper to get label by value
    getCategoryLabel: (state) => (value: string) => {
      const found = state.codes?.category.find((c) => c.value === value);
      return found ? found.label : value;
    },

    getDeliveryLabel: (state) => (value: string) => {
      const found = state.codes?.deliveryType.find((c) => c.value === value);
      return found ? found.label : value;
    },
  },

  actions: {
    async fetchCodes() {
      if (this.codes) return; // 이미 로드되었으면 스킵

      this.loading = true;
      try {
        const data = await getSystemCodes();
        this.codes = data;
      } catch (error) {
        console.error("Failed to fetch system codes:", error);
        // Fallback or retry logic can be added here
      } finally {
        this.loading = false;
      }
    },
  },
});
