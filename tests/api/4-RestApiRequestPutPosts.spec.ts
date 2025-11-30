import { test, expect, request } from "@playwright/test";

// Test for validating the PUT request to update a post via an API (jsonplaceholder.typicode.com)
test("PUT Request to Update Post", async ({ request }) => {
  // Test data initialization
  const restApiUrl: string = "https://jsonplaceholder.typicode.com/"; // The base URL of the API
  const path: string = "posts"; // API endpoint for posts

  // Data to be sent in the PUT request body for updating the post
  const updatedRequestBody = {
    title: "updatedTitle", // Updated title of the post
    body: "updatedBody", // Updated body content of the post
    userId: 1, // User ID associated with the post (same as the original post)
  };

  const postId = 1; // ID of the post to update (for example, we are updating post with ID 1)

  // Step 1: Send PUT request to update the existing post
  const updatePostResponse = await request.put(
    `${restApiUrl}${path}/${postId}`, // Concatenate the base URL with the 'posts' endpoint and post ID
    {
      data: updatedRequestBody, // Send the updated data for the post
      headers: {
        "Content-Type": "application/json; charset=UTF-8", // Set the correct Content-Type header for JSON data
      },
    }
  );

  // Step 2: Verify the status of the API response
  expect(updatePostResponse.ok()).toBeTruthy(); // Assert that the request was successful (status code 2xx)
  expect(updatePostResponse.status()).toBe(200); // Assert that the status code is 200 (OK) for successful update

  // Step 3: Parse the JSON response body
  const responseBody = await updatePostResponse.json(); // Convert the response body to JSON format
  console.log(responseBody); // Print the response body for debugging purposes

  // Step 4: Validate the response data
  // Validate that the post ID in the response matches the requested post ID
  expect(responseBody.id).toBe(postId); // Assert that the ID in the response is the same as the post ID we updated

  // Validate that the title in the response matches the updated title
  expect(responseBody).toHaveProperty("title", updatedRequestBody.title); // Assert that the 'title' in the response matches the updated title

  // Validate that the body in the response matches the updated body
  expect(responseBody).toHaveProperty("body", updatedRequestBody.body); // Assert that the 'body' in the response matches the updated body

  // Validate that the userId in the response matches the userId from the request body
  expect(responseBody.userId).toBe(updatedRequestBody.userId); // Assert that the 'userId' in the response matches the request body
});
