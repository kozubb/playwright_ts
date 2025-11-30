import { test, expect, request } from "@playwright/test";

// Test for validating the GET request for a user through an API (using jsonplaceholder.typicode.com)
test("GET Request for User Data", async ({ request }) => {
  // Test data initialization
  const restApiUrl: string = "https://jsonplaceholder.typicode.com/"; // The base URL of the API
  const path: string = "users"; // API endpoint for users
  const expectedName: string = "Kurtis Weissnat"; // Expected name of the user in the API response
  const expectedUsername: string = "Elwyn.Skiles"; // Expected username of the user in the API response
  const expectedCity: string = "Howemouth"; // Expected city in the user's address
  const expectedCompanyName: string = "Johns Group"; // Expected company name of the user
  const expectedCatchPhrase: string = "Configurable multimedia task-force"; // Expected company catchphrase

  // Step 1: Send GET request to the users API
  const userDataStatus = await request.get(
    `${restApiUrl}${path}/7`, // Concatenate the URL with the user ID (7 in this case)
    {
      headers: {
        Accept: "application/json", // Set the expected response format to JSON
      },
    }
  );

  // Step 2: Verify the status of the API response
  expect(userDataStatus.ok()).toBeTruthy(); // Ensure the response is successful (status code 2xx)
  expect(userDataStatus.status()).toBe(200); // Assert that the status code is 200 OK

  // Step 3: Parse the JSON response body
  const responseBody = await userDataStatus.json(); // Convert the response to JSON format
  console.log(responseBody); // Print the response body for debugging purposes

  // Step 4: Validate the response data
  // Validate the user's name
  expect(responseBody.name).toBe(expectedName); // Assert that the name field matches the expected value

  // Validate the username field
  expect(responseBody).toHaveProperty("username", expectedUsername); // Assert that the response contains the expected username

  // Validate the address - specifically the city
  expect(responseBody.address).toHaveProperty("city", expectedCity); // Assert that the city in the address matches the expected value

  // Validate the company name
  expect(responseBody.company).toHaveProperty("name", expectedCompanyName); // Assert that the company name is as expected

  // Validate the company catchphrase
  expect(responseBody.company.catchPhrase).toBe(expectedCatchPhrase); // Assert that the company catchphrase matches the expected value
});
