import { test, expect, request } from "@playwright/test";

// Test data initialization
const restApiUrl: string = "https://api.zippopotam.us/";
const countryCode: string = "us";
const zipCode: number = 28270;
const notExistedZipCode: number = 11111;
const country: string = "United States";
const stateCode: string = "NC";
const stateName: string = "North Carolina";
const city: string = "Charlotte";

// Test for validating the GET request for a ZipCode via an API
test("GET Request Zipcode", async ({ request }) => {
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

// Test to validate the GET request for a non-existent ZipCode (404 Not Found)
test("GET Request Zipcode - Not Found (404 code)", async ({ request }) => {
  // Step 1: Send GET request to the ZipCode API to check for a 404 not found status
  const zipcodeRequestStatus = await request.get(
    `${restApiUrl}${countryCode}/${notExistedZipCode}`, // Construct the URL with country code and non-existent zip code
    {
      headers: {
        Accept: "application/json", // Specify that the expected response format is JSON
      },
    }
  );

  // Step 2: Assert that the status code of the response is 404 (Not Found)
  expect(zipcodeRequestStatus.status()).toBe(404);
});
