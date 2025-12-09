import { test, expect, request } from "@playwright/test";

// Test for validating the POST request to create a new post via an API (jsonplaceholder.typicode.com)
test("POST Request to Create Post", async ({ request }) => {
  // Test data initialization
  const restApiUrl: string = "https://jsonplaceholder.typicode.com/";
  const path: string = "posts";
  const requestBody = {
    // Data to be sent in the POST request body
    title: "testTitle",
    body: "bodyTitle",
    userId: 1,
  };

  // Step 1: Send POST request to create a new post
  const postDataResponse = await request.post(
    `${restApiUrl}${path}`, // Concatenate the base URL with the 'posts' endpoint
    {
      data: requestBody, // Send the request body with the data for the new post
      headers: {
        "Content-Type": "application/json; charset=UTF-8", // Set the correct Content-Type header for JSON data
      },
    }
  );

  // Step 2: Verify the status of the API response
  expect(postDataResponse.ok()).toBeTruthy(); // Assert that the request was successful (status code 2xx)
  expect(postDataResponse.status()).toBe(201); // Assert that the status code is 201 (Created)

  // Step 3: Parse the JSON response body
  const responseBody = await postDataResponse.json(); // Convert the response body to JSON format
  console.log(responseBody); // Print the response body for debugging purposes

  // Step 4: Validate the response data
  // Validate that the userId in the response matches the request body
  expect(responseBody.userId).toBe(requestBody.userId); // Assert that the userId matches the expected value

  // Validate that the title in the response matches the title sent in the request body
  expect(responseBody).toHaveProperty("title", requestBody.title); // Assert that the 'title' in the response matches the request body

  // Validate that the body in the response matches the body sent in the request body
  expect(responseBody).toHaveProperty("body", requestBody.body); // Assert that the 'body' in the response matches the request body
});
