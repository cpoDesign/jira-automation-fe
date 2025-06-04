// Example usage of the generated API client
import { AccountService, OpenAPI } from "./generated";

// Set the base URL for the API (can be set from env or hardcoded)
OpenAPI.BASE =
  "https://jirabackendfunctions20250524235736.azurewebsites.net/api";

export async function closeAccountExample() {
  try {
    const result = await AccountService.closeAccount();
    console.log("Account closed:", result);
    return result;
  } catch (error) {
    console.error("Error closing account:", error);
    throw error;
  }
}
