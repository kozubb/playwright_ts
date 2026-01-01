import { test, expect } from "@playwright/test";
import { z } from "zod";

/**
 * API CONTRACT DEFINITIONS
 * JSONPlaceholder returns a nested User object.
 * We define sub-schemas for 'address' and 'company' for better modularity.
 */

const AddressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: z.object({
    lat: z.string(),
    lng: z.string(),
  }),
});

const CompanySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

// Main User Contract
const UserResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  address: AddressSchema,
  phone: z.string(),
  website: z.string(),
  company: CompanySchema,
});

// TEST DATA & CONFIGURATION
const restApiUrl = "https://jsonplaceholder.typicode.com/";
const path = "users";
const notExistedPath = "userstest";
const expectedName = "Kurtis Weissnat";
const expectedUsername = "Elwyn.Skiles";
const expectedCity = "Howemouth";
const expectedCompanyName = "Johns Group";
const expectedCatchPhrase = "Configurable multimedia task-force";

// TEST SUITE

test("GET Request for User Data - Contract & Value Validation", async ({
  request,
}) => {
  // Step 1: Send GET request to the users API
  const response = await request.get(`${restApiUrl}${path}/7`, {
    headers: {
      Accept: "application/json",
    },
  });

  // Step 2: Verify the status of the API response
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  // Step 3: Parse the JSON response body
  const responseBody = await response.json();

  /**
   * STEP 4: CONTRACT VALIDATION
   * Validating the entire nested structure of the User object.
   */
  const contractValidation = UserResponseSchema.safeParse(responseBody);

  if (!contractValidation.success) {
    // Detailed error logging for CI/CD environments
    console.error(
      "Contract Violation Details:",
      contractValidation.error.format()
    );
  }
  expect(
    contractValidation.success,
    "API response must match the User Contract"
  ).toBe(true);

  /**
   * STEP 5: FUNCTIONAL DATA VALIDATION
   * Using validatedData for full IntelliSense support and type safety.
   */
  const validatedData = contractValidation.data!;

  expect(validatedData.name).toBe(expectedName);
  expect(validatedData.username).toBe(expectedUsername);
  expect(validatedData.address.city).toBe(expectedCity);
  expect(validatedData.company.name).toBe(expectedCompanyName);
  expect(validatedData.company.catchPhrase).toBe(expectedCatchPhrase);
});

test("GET Request for User Data (404 Not Found)", async ({ request }) => {
  // Step 1: Send a GET request to a non-existent endpoint
  const response = await request.get(`${restApiUrl}${notExistedPath}/7`);

  // Step 2: Assert that the status code is 404 (Not Found)
  expect(response.status()).toBe(404);
});
