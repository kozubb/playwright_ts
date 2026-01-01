import { test, expect } from "@playwright/test";
import { z } from "zod";

/** * API CONTRACT DEFINITIONS
 * We define the expected structure of the API response here.
 * If the Backend team changes a field name or type, these schemas will catch it.
 */

// Schema for an individual place object inside the 'places' array
const PlaceSchema = z.object({
  "place name": z.string(),
  longitude: z.string(),
  state: z.string(),
  "state abbreviation": z.string(),
  latitude: z.string(),
});

// Main schema for the successful ZipCode API response
const ZipCodeResponseSchema = z.object({
  "post code": z.string(),
  country: z.string(),
  "country abbreviation": z.string(),
  places: z.array(PlaceSchema),
});

// Schema for 404 errors (Zippopotam returns an empty object for invalid zips)
const EmptyResponseSchema = z.object({}).strict();

//TEST DATA & CONFIGURATION
const restApiUrl = "https://api.zippopotam.us/";
const countryCode = "us";
const zipCode = 28270;
const notExistedZipCode = 11111;
const country = "United States";
const stateName = "North Carolina";
const city = "Charlotte";

test("GET Request Zipcode - Contract & Functional Validation", async ({
  request,
}) => {
  // Step 1: Execute GET request
  const response = await request.get(`${restApiUrl}${countryCode}/${zipCode}`, {
    headers: {
      Accept: "application/json",
    },
  });

  // Step 2: Basic HTTP status validation
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  /**
   * STEP 3: CONTRACT VALIDATION
   * We use safeParse to check if the response body matches our schema.
   * This ensures the API structure hasn't changed (Field names, Types, etc.)
   */
  const contractValidation = ZipCodeResponseSchema.safeParse(responseBody);

  if (!contractValidation.success) {
    // Log detailed schema errors for easier debugging in CI/CD (GitHub Actions)
    console.error(
      "Contract Violation Found:",
      contractValidation.error.format()
    );
  }

  // Assert that the contract is valid
  expect(
    contractValidation.success,
    "The API response should match the defined Zod contract"
  ).toBe(true);

  /**
   * STEP 4: FUNCTIONAL DATA VALIDATION
   * Once the contract is confirmed, we check if the actual data values are correct.
   */
  const validatedData = contractValidation.data!; // Access typed data from Zod

  expect(validatedData.country).toBe(country);
  expect(validatedData.places[0]["place name"]).toBe(city);
  expect(validatedData.places[0].state).toBe(stateName);
  expect(validatedData.places[0]["state abbreviation"]).toBe("NC");
});

test("GET Request Zipcode - Not Found (404) Contract Validation", async ({
  request,
}) => {
  // Step 1: Send request for a non-existent zip code
  const response = await request.get(
    `${restApiUrl}${countryCode}/${notExistedZipCode}`
  );

  // Step 2: Validate 404 Status
  expect(response.status()).toBe(404);

  // Step 3: Validate that the error response structure is as expected (Empty object)
  const responseBody = await response.json();
  const contractValidation = EmptyResponseSchema.safeParse(responseBody);

  expect(
    contractValidation.success,
    "404 response should be an empty object"
  ).toBe(true);
});
