import { test } from "@playwright/test";
import LoginPage from "../../pages/SauceDemo/Login";
import ProductListing from "../../pages/SauceDemo/ProductListing";
import HamburgerMenu from "../../pages/SauceDemo/HamburgerMenu";

// Test data - endpoint, credentials, and messages
const endpoint: string = "https://www.saucedemo.com";
const username: string = "standard_user"; // Username for login
const lockedUsername: string = "locked_out_user"; // Locked-out username
const password: string = "secret_sauce"; // Password for login
const wrongPassword: string = "test_password"; // Incorrect password
const wrongDataMessage: string =
  "Username and password do not match any user in this service";
const lockedUserMessage: string = "Sorry, this user has been locked out.";

// E2E test: Successful login and logout
test("Login into account and logout - success", async ({ page }) => {
  // Step 1: Initialize page objects
  const login = new LoginPage(page);
  const productListing = new ProductListing(page);
  const hamburgerMenu = new HamburgerMenu(page);

  // Step 2: Navigate to the login page
  await page.goto(endpoint);

  // Step 3: Fill in the login form with valid credentials
  await login.fillInput("username", username);
  await login.fillInput("password", password);

  // Step 4: Press the login button
  login.pressLoginButton();

  // Step 5: Verify that inventory page is loaded and cart is visible
  await page.waitForURL(`${endpoint}/inventory.html`);
  productListing.checkIfCartIsVisible();

  // Step 6: Open hamburger menu and log out
  hamburgerMenu.pressHamburgerMenuIcon();
  hamburgerMenu.pressHamburgerMenuLogoutBtn();

  // Step 7: Verify return to login page
  await page.waitForURL(`${endpoint}`);
  login.checkIfLoginButtonIsVisible();
});

// E2E test: Login with wrong password
test("login - wrong password", async ({ page }) => {
  // Step 1: Initialize page objects
  const login = new LoginPage(page);

  // Step 2: Navigate to the login page
  await page.goto(endpoint);

  // Step 3: Fill in the login form with username and incorrect password
  await login.fillInput("username", username);
  await login.fillInput("password", wrongPassword);

  // Step 4: Press the login button
  login.pressLoginButton();

  // Step 5: Verify error message for wrong credentials
  login.checkLoginErrorMessage(wrongDataMessage);
});

// E2E test: Login with locked-out user
test("login - user is locked", async ({ page }) => {
  // Step 1: Initialize page objects
  const login = new LoginPage(page);

  // Step 2: Navigate to the login page
  await page.goto(endpoint);

  // Step 3: Fill in the login form with locked-out username
  await login.fillInput("username", lockedUsername);
  await login.fillInput("password", password);

  // Step 4: Press the login button
  login.pressLoginButton();

  // Step 5: Verify error message for locked user
  login.checkLoginErrorMessage(lockedUserMessage);
});
