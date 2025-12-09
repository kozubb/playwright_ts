import { test, expect, request } from "@playwright/test";

// Test for validating the DELETE request to remove a post via an API (jsonplaceholder.typicode.com)
test("DELETE Request to Remove Post", async ({ request }) => {
  // Test data initialization
  const restApiUrl: string = "https://jsonplaceholder.typicode.com/";
  const path: string = "posts";

  const postId = 1; // ID of the post to delete (for example, we are deleting post with ID 1)

  // Step 1: Send DELETE request to remove the existing post
  const deletePostResponse = await request.delete(
    `${restApiUrl}${path}/${postId}` // Concatenate the base URL with the 'posts' endpoint and post ID
  );

  // Step 2: Verify the status of the API response
  expect(deletePostResponse.ok()).toBeTruthy(); // Assert that the request was successful (status code 2xx)
  expect(deletePostResponse.status()).toBe(200); // Assert that the status code is 200 (OK) for successful deletion
});
