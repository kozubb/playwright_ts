import { test, expect } from "@playwright/test";
import { RegisterDto } from "./registerForm.dto";

test("Register account", async ({ page }) => {
  const endpoint: any = "https://practice.qabrains.com/";
  const registerSuccessfulMsg: string = "Registration Successful";
  const registerRequest: any = page.waitForResponse(
    (response) =>
      response.url().includes("registration?registered=true") &&
      response.status() === 200
  );

  const registerData: RegisterDto = {
    name: "test name",
    country: "Poland",
    accountType: "Private Job",
    email: "test@test.com",
    password: "Test123!",
  };

  await page.goto(`${endpoint}registration`);
  await page.getByRole("textbox", { name: /name/i }).fill(registerData.name);
  await page
    .getByRole("combobox", { name: /select country/i })
    .selectOption(registerData.country);
  await page
    .getByRole("combobox", { name: /account type/i })
    .selectOption(registerData.accountType);
  await page.getByRole("textbox", { name: /email/i }).fill(registerData.email);
  await page
    .getByRole("textbox", { name: /password/i })
    .first()
    .fill(registerData.password);
  await page
    .getByRole("textbox", { name: /confirm password/i })
    .fill(registerData.password);
  await page.getByRole("button", { name: /signup/i }).click();
  const response = await registerRequest;
  expect(response.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: /registration successful/i })
  ).toHaveText(registerSuccessfulMsg);
});
