import { test, expect, request } from "@playwright/test";

// Test for validating the GET request for a ZipCode via an API
test("GET Request Zipcode", async ({ request }) => {
  // Test data initialization
  const restApiUrl: string = "https://api.zippopotam.us/";
  const countryCode: string = "us";
  const zipCode: number = 28270;
  const country: string = "United States";
  const stateCode: string = "NC";
  const stateName: string = "North Carolina";
  const city: string = "Charlotte";

  // Step 1: Send GET request to the ZipCode API
  const zipcodeRequestStatus = await request.get(
    `${restApiUrl}${countryCode}/${zipCode}`, // Concatenate the URL with the country code and zip code using template literals
    {
      headers: {
        Accept: "application/json", // Set the expected response format to JSON
      },
    }
  );

  // Step 2: Verify the status of the API response
  expect(zipcodeRequestStatus.ok).toBeTruthy(); // Ensure the response is successful (status code 2xx)
  expect(zipcodeRequestStatus.status()).toBe(200); // Assert that the status code is 200 OK

  // Step 3: Parse the JSON response body
  const responseBody = await zipcodeRequestStatus.json(); // Convert the response to JSON
  console.log(responseBody); // Print the response body for debugging purposes

  // Step 4: Validate the response data
  expect(responseBody.country).toBe(country); // Assert that the country field matches the expected value
  expect(responseBody).toHaveProperty("country", country); // Check that the response has the 'country' property
  expect(responseBody.places[0]).toHaveProperty("place name", city); // Check that the first place in the array has the correct city name
  expect(responseBody.places[0]).toHaveProperty(
    "state abbreviation",
    stateCode
  ); // Check that the state abbreviation is correct
  expect(responseBody.places[0].state).toBe(stateName); // Check that the state name matches the expected value
});
