// tests/services/fetchSites.spec.js
import { describe, it, expect, vi } from "vitest"
import { fetchSitesByName } from "@/utils/apiCall"
import { mayaClient } from "@/services/api"

vi.mock("@/services/api", () => ({
  mayaClient: {
    get: vi.fn(),
  },
}))

describe("fetchSitesByName", () => {
  it("trims input and returns API response data", async () => {
    const mockResponse = [
      {
        SiteID: "AP#Private#Parking",
        Name: "#1 Parking",
        Address:
          "20-3/1-47/1, ramalingeswar peat,ayodyanagar, Vijayawada 520003",
        Type: 1,
      },
    ]

    mayaClient.get.mockResolvedValueOnce({ data: mockResponse })

    const result = await fetchSitesByName("   #1 Parking   ")

    expect(mayaClient.get).toHaveBeenCalledWith(
      "/sites-by-name?name=#1 Parking"
    )
    expect(result).toEqual(mockResponse)
  })

  it("throws error when API call fails", async () => {
    mayaClient.get.mockRejectedValueOnce(new Error("Network Error"))

    await expect(fetchSitesByName("Test")).rejects.toThrow("Network Error")
  })
})
