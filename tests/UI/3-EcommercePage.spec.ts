import { test, expect } from "@playwright/test";

test("E2E test - place order", async ({ page }) => {
  const endpoint: any = "https://practice.qabrains.com/";
  const email: string = "test@qabrains.com";
  const password: string = "Password123";
  const loginButton: any = page.getByRole("button", { name: /login/i });
  const productName: any = page.locator(".text-lg.block");
  const shoeName: string = "Sample Shoe Name";
  const addToOrderButton: any = page.locator("button", {
    hasText: /add to cart/i,
  });
  const basketAmount = page.locator(".bg-qa-clr");

  await page.goto(`${endpoint}ecommerce/login`);
  await page.getByRole("textbox", { name: /email/i }).fill(email);
  await page.getByRole("textbox", { name: /password/i }).fill(password);
  await loginButton.click();
  await page.waitForRequest(`${endpoint}ecommerce?_rsc*`);
  await page.waitForRequest(`${endpoint}ecommerce/product-details*`);
  await expect(page.locator(".user-name")).toHaveText(email);
  const productCount = await productName.count();

  for (let i = 0; i < productCount; i++) {
    const productText = await productName.nth(i).textContent();

    if (productText == shoeName) {
      const button = await addToOrderButton.nth(i);
      await button.click();
      break;
    }
  }

  await expect(basketAmount).toHaveText("1");
  await expect(
    page.getByRole("button", { name: /remove from cart/i })
  ).toBeVisible();
  await basketAmount.click();
  const cartResponse = page.waitForResponse(`${endpoint}ecommerce/cart*`);
  const responseCart = await cartResponse;
  expect(responseCart.status()).toBe(200);
  await page.waitForURL(`${endpoint}ecommerce/cart`);
  expect(page).toHaveURL(`${endpoint}ecommerce/cart`);
});
