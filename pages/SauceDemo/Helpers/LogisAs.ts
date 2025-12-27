import { Page } from "@playwright/test";
import LoginPage from "../Login";

interface LoginOptions {
  username: string;
  password: string;
  endpoint: string;
}

//Helper responsible for logging user into SauceDemo page

export async function loginAs(
  page: Page,
  { username, password, endpoint }: LoginOptions
): Promise<void> {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await page.goto(endpoint);

  // Fill login form
  await loginPage.fillInput("username", username);
  await loginPage.fillInput("password", password);

  // Submit login form
  await loginPage.pressLoginButton();
}
