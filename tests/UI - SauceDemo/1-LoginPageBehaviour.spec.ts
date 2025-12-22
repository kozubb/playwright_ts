import { test } from "@playwright/test";
import LoginPage from "../../pages/SauceDemo/Login";
import ProductListing from "../../pages/SauceDemo/ProductListing";
import HamburgerMenu from "../../pages/SauceDemo/HamburgerMenu";

// E2E test for logging into an account and verifying login/logout functionality
test("Login into account and logout - success", async ({ page }) => {
  // Test data - endpoint, credentials, and messages
  const endpoint: string = "https://www.saucedemo.com";
  const username: string = "standard_user"; // Username for login
  const password: string = "secret_sauce"; // Password for login

  // Step 1: Initialize page objects
  const login = new LoginPage(page);
  const productListing = new ProductListing(page);
  const hamburgerMenu = new HamburgerMenu(page);

  // Step 2: Navigate to the login page
  await page.goto(endpoint);

  // Step 3: Fill in the login form with test credentials
  await login.fillInput("username", username); // Fill the username field
  await login.fillInput("password", password); // Fill the password field

  // Step 4: Press the login button
  login.pressLoginButton();

  // Step 5: Wait for the inventory page to load and verify the cart is visible
  await page.waitForURL(`${endpoint}/inventory.html`);
  productListing.checkIfCartIsVisible();

  // Step 6: Open the hamburger menu and log out
  hamburgerMenu.pressHamburgerMenuIcon();
  hamburgerMenu.pressHamburgerMenuLogoutBtn();

  // Step 7: Verify that the login page is shown again
  await page.waitForURL(`${endpoint}`);
  login.checkIfLoginButtonIsVisible();
});
