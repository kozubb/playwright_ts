import { test, expect } from "@playwright/test"; // Import Playwright testing functions
import { RegisterDto } from "./registerForm.dto"; // Import RegisterDto for test data typing

// E2E test for registering a new account
test("Register account", async ({ page }) => {
  // Test data initialization
  const endpoint: string = "https://practice.qabrains.com/"; // URL of the registration page
  const registerSuccessfulMsg: string = "Registration Successful"; // Message displayed after successful registration

  // Set up a response listener to wait for the registration response
  const registerRequest = page.waitForResponse(
    (response) =>
      response.url().includes("registration?registered=true") && // Ensure the URL contains 'registration?registered=true' (successful registration)
      response.status() === 200 // Ensure the response status is 200 (OK)
  );

  // Register data: Data to be used for registration
  const registerData: RegisterDto = {
    name: "test name", // Name of the user
    country: "Poland", // Country the user is from
    accountType: "Private Job", // Account type (e.g., private job or other)
    email: "test@test.com", // Email address for registration
    password: "Test123!", // Password for the account
  };

  // Step 1: Navigate to the registration page
  await page.goto(`${endpoint}registration`);

  // Step 2: Fill in the registration form with provided data
  await page.getByRole("textbox", { name: /name/i }).fill(registerData.name); // Fill in the 'name' field
  await page
    .getByRole("combobox", { name: /select country/i })
    .selectOption(registerData.country); // Select the country from the dropdown
  await page
    .getByRole("combobox", { name: /account type/i })
    .selectOption(registerData.accountType); // Select the account type from the dropdown
  await page.getByRole("textbox", { name: /email/i }).fill(registerData.email); // Fill in the 'email' field
  await page
    .getByRole("textbox", { name: /password/i })
    .first()
    .fill(registerData.password); // Fill in the 'password' field
  await page
    .getByRole("textbox", { name: /confirm password/i })
    .fill(registerData.password); // Fill in the 'confirm password' field to match the password

  // Step 3: Click the signup button to submit the form
  await page.getByRole("button", { name: /signup/i }).click(); // Click the 'signup' button

  // Step 4: Wait for the registration response
  const response = await registerRequest; // Wait for the response that confirms registration is successful
  expect(response.status()).toBe(200); // Assert that the response status is 200 (successful registration)

  // Step 5: Verify that the "Registration Successful" message appears
  await expect(
    page.getByRole("heading", { name: /registration successful/i })
  ).toHaveText(registerSuccessfulMsg); // Verify that the heading contains the 'Registration Successful' message
});
