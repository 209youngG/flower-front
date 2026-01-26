import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../user-store";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorage } from "quasar";
import * as authApi from "src/api/auth";

// Mock API and LocalStorage
vi.mock("quasar", () => ({
  LocalStorage: {
    getItem: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("src/api/auth", () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

describe("User Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should initialize with user from LocalStorage if present", () => {
    const mockUser = { id: 1, email: "test@test.com", role: "USER", name: "Test" };
    (LocalStorage.getItem as any).mockReturnValue(mockUser);

    const store = useUserStore();
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
  });

  it("should login successfully and save to LocalStorage", async () => {
    const mockUser = { id: 1, email: "test@test.com", role: "USER", name: "Test" };
    (authApi.login as any).mockResolvedValue(mockUser);

    const store = useUserStore();
    const result = await store.login({ loginId: "test", password: "pw" });

    expect(result).toBe(true);
    expect(store.user).toEqual(mockUser);
    expect(LocalStorage.set).toHaveBeenCalledWith("user", mockUser);
  });

  it("should logout and clear LocalStorage", () => {
    const store = useUserStore();
    store.user = { id: 1, email: "test", role: "USER", name: "Test" }; // Manually set state

    store.logout();

    expect(store.user).toBeNull();
    expect(LocalStorage.remove).toHaveBeenCalledWith("user");
  });

  it("should identify admin role correctly", () => {
    const store = useUserStore();
    
    store.user = { id: 1, role: "USER", name: "U", email: "e" };
    expect(store.isAdmin).toBe(false);

    store.user = { id: 2, role: "ROOT_ADMIN", name: "A", email: "e" };
    expect(store.isAdmin).toBe(true);
  });
});
