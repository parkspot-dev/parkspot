import { describe, it, expect, vi, beforeEach } from "vitest";
import kycStatusPortal from "@/store/kycStatusPortal/index";
import { mayaClient } from "@/services/api";

// Mock maya
vi.mock("@/services/api", () => ({
  mayaClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("Vuex Module: KycStatusPortal", () => {
  let state;

  beforeEach(() => {
    // reset state before each test
    state = { ...kycStatusPortal.state };
    vi.clearAllMocks();
  });

  // States
  it("has correct initial state", () => {
    expect(state.users).toEqual([]);
    expect(state.hasError).toBe(false);
    expect(state.errorMessage).toBe("");
    expect(state.isLoading).toBe(false);
    expect(state.searchMobile).toBe("");
  });

  // Getters
  describe("getters", () => {
    it("getter isLoading returns correct value", () => {
      state.isLoading = true;
      expect(kycStatusPortal.getters.isLoading(state)).toBe(true);
    });
  });

  // Mutations
  describe("mutations", () => {
    it("set-users updates users and resets error", () => {
      kycStatusPortal.mutations["set-users"](state, [{ id: 1 }]);
      expect(state.users).toEqual([{ id: 1 }]);
      expect(state.hasError).toBe(false);
    });

    it("set-error updates errorMessage and hasError", () => {
      kycStatusPortal.mutations["set-error"](state, "Failed");
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe("Failed");
    });

    it("set-loading updates loading state", () => {
      kycStatusPortal.mutations["set-loading"](state, true);
      expect(state.isLoading).toBe(true);
    });

    it("set-search-mobile updates searchMobile", () => {
      kycStatusPortal.mutations["set-search-mobile"](state, "9999999999");
      expect(state.searchMobile).toBe("9999999999");
    });
  });

  // Actions
  describe("actions.fetchKycPendingUsers", () => {
    it("commits set-users on success", async () => {
      const commit = vi.fn();

      const mockUsers = [
        {
          UserName: "testuser1",
          FullName: "Test User One",
          Mobile: "9000000001",
          KYCStatus: 1,
          IDProofURLs: ["https://example.com/user1-id.jpg"],
          OwnershipProofURLs: ["https://example.com/user1-ownership.jpg"],
          IdentityDocument: "Passport",
          OwnershipDocument: "Car RC",
        },
      ];

      mayaClient.get.mockResolvedValue(mockUsers);

      await kycStatusPortal.actions.fetchKycPendingUsers({ commit, state });

      expect(commit).toHaveBeenCalledWith("set-loading", true);
      expect(commit).toHaveBeenCalledWith("set-users", mockUsers);
      expect(commit).toHaveBeenCalledWith("set-loading", false);
    });

    it("commits set-error on failure", async () => {
      const commit = vi.fn();
      mayaClient.get.mockRejectedValue(new Error("API failed"));

      await kycStatusPortal.actions.fetchKycPendingUsers({ commit, state });

      expect(commit).toHaveBeenCalledWith("set-loading", true);
      expect(commit).toHaveBeenCalledWith("set-error", "API failed");
      expect(commit).toHaveBeenCalledWith("set-loading", false);
    });
  });

  describe("actions.updateStatus", () => {
    it("commits set-error when API returns DisplayMsg (failure)", async () => {
      const commit = vi.fn();
      const userData = { UserName: "john", KYCStatus: "APPROVED" };

      mayaClient.patch.mockResolvedValue({
        DisplayMsg: "Invalid status",
        ErrorMsg: "ERR_CODE",
      });

      await kycStatusPortal.actions.updateStatus({ commit }, { userData });

      expect(commit).toHaveBeenCalledWith("set-loading", true);
      expect(commit).toHaveBeenCalledWith(
        "set-error",
        "Invalid status ( ERR_CODE )"
      );
      expect(commit).toHaveBeenCalledWith("set-loading", false);
    });

    it("does not commit set-error when API succeeds", async () => {
      const commit = vi.fn();
      const userData = { UserName: "john", KYCStatus: "APPROVED" };

      mayaClient.patch.mockResolvedValue({ Success: true });

      await kycStatusPortal.actions.updateStatus({ commit }, { userData });

      expect(commit).toHaveBeenCalledWith("set-loading", true);
      expect(commit).not.toHaveBeenCalledWith("set-error", expect.anything());
      expect(commit).toHaveBeenCalledWith("set-loading", false);
    });
  });

  describe("actions.updateMobileInput", () => {
    it("commits set-search-mobile", () => {
      const commit = vi.fn();
      kycStatusPortal.actions.updateMobileInput({ commit }, "9876543210");
      expect(commit).toHaveBeenCalledWith("set-search-mobile", "9876543210");
    });
  });
});