import { test, expect } from "@playwright/test";

test("Login into account", async ({ page }) => {
  const endpoint: any = "https://practice.qabrains.com/";
  const email: string = "qa_testers@qabrains.com";
  const password: string = "Password123";
  const loginSuccessfulMsg: string = "Login Successful";
  const loginButton: any = page.getByRole('button', {name: /login/i})
  const logoutButton: any = page.getByRole('button', {name: /logout/i})
  const responsePromise: any = page.waitForResponse(response =>
    response.url().includes('/?_rsc') && response.status() === 200
  );

  await page.goto(endpoint);
  await page.getByRole('textbox', {name: /email/i}).fill(email)
  await page.getByRole('textbox', {name: /password/i}).fill(password)
  await loginButton.click()
  await page.waitForRequest(`${endpoint}?logged=true*`)
  await expect(page.getByRole('heading', {name: /login successful/i})).toHaveText(loginSuccessfulMsg)
  await expect(logoutButton).toBeVisible()
  await logoutButton.click()
  const response = await responsePromise;
  expect(response.status()).toBe(200)
  await expect(loginButton).toBeVisible()
});
