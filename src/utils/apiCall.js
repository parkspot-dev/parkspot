import { mayaClient } from "@/services/api"

// Function to fetch sites by name
export async function fetchSitesByName(name) {
  try {
    const trimmedName = name.trim()
    const response = await mayaClient.get(`/sites-by-name?name=${trimmedName}`)
    return response.data  
  } catch (error) {
    console.error("Error fetching sites by name:", error)
    throw error
  }
}

fetchSitesByName(" #1 Parking ")
  .then(data => {
    console.log("API Response:", data)
  })
  .catch(err => {
    console.error("API Error:", err.message)
  })
