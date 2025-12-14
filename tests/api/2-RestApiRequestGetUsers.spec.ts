import { test, expect, request } from "@playwright/test";
// Test data initialization
const restApiUrl: string = "https://jsonplaceholder.typicode.com/";
const path: string = "users";
const notExistedPath: string = "userstest";
const expectedName: string = "Kurtis Weissnat";
const expectedUsername: string = "Elwyn.Skiles";
const expectedCity: string = "Howemouth";
const expectedCompanyName: string = "Johns Group";
const expectedCatchPhrase: string = "Configurable multimedia task-force";

// Test for validating the GET request for a user through an API (using jsonplaceholder.typicode.com)
test("GET Request for User Data", async ({ request }) => {
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

// Test to validate the GET request for a non-existent path (404 Not Found)
test("GET Request for User Data (404 Not Found)", async ({ request }) => {
  // Step 1: Send a GET request to the users API with a non-existent path
  const userDataStatus = await request.get(
    `${restApiUrl}${notExistedPath}/7`, // Construct the URL with a non-existent path
    {
      headers: {
        Accept: "application/json", // Specify the expected response format as JSON
      },
    }
  );

  // Step 2: Assert that the status code is 404 (Not Found)
  expect(userDataStatus.status()).toBe(404); // Validate that the response code is 404 for non-existent path
});
