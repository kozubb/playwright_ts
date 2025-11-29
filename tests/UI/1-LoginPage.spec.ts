import { test, expect } from "@playwright/test";

// E2E test for logging into an account and verifying login/logout functionality
test("Login into account", async ({ page }) => {
  // Test data - endpoint, credentials, and messages
  const endpoint: string = "https://practice.qabrains.com/";
  const email: string = "qa_testers@qabrains.com"; // Email for login
  const password: string = "Password123"; // Password for login
  const loginSuccessfulMsg: string = "Login Successful"; // Expected message on successful login

  // Locators for buttons
  const loginButton = page.getByRole("button", { name: /login/i }); // Locator for login button
  const logoutButton = page.getByRole("button", { name: /logout/i }); // Locator for logout button

  // Wait for a network response that confirms login (via the response URL pattern)
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes("/?_rsc") && response.status() === 200 // Waiting for a specific request after login
  );

  // Step 1: Navigate to the login page
  await page.goto(endpoint); // Navigate to the main endpoint

  // Step 2: Fill in the login form with test credentials
  await page.getByRole("textbox", { name: /email/i }).fill(email); // Fill the email field
  await page.getByRole("textbox", { name: /password/i }).fill(password); // Fill the password field

  // Step 3: Click the login button
  await loginButton.click(); // Click the login button

  // Step 4: Wait for the login request to be completed and check the successful login message
  await page.waitForRequest(`${endpoint}?logged=true*`); // Wait for a request indicating the login was successful
  await expect(
    page.getByRole("heading", { name: /login successful/i })
  ).toHaveText(loginSuccessfulMsg); // Check if the login successful message is displayed

  // Step 5: Verify that the logout button is visible after login
  await expect(logoutButton).toBeVisible(); // Assert that the logout button is visible after login

  // Step 6: Click the logout button to log out of the account
  await logoutButton.click(); // Click the logout button

  // Step 7: Wait for the response confirming the logout action
  const response = await responsePromise; // Wait for the response to confirm the request after logout
  expect(response.status()).toBe(200); // Verify that the response status is 200 OK

  // Step 8: Ensure that the login button is visible again after logout
  await expect(loginButton).toBeVisible(); // Assert that the login button is visible after logout
});
