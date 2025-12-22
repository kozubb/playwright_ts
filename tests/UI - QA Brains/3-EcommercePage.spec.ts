import { test, expect, Locator, Page, Response } from "@playwright/test";

// Test data types
const endpoint: string = "https://practice.qabrains.com/";
const email: string = "test@qabrains.com";
const password: string = "Password123";
const shoeName: string = "Sample Shoe Name";
const firstName: string = "TestName";
const lastName: string = "TestLasNname";
const zipCode: number = 1207;
const shoePrice: number = 89.0;
const deliveryPrice: number = 4.45;
const totalPrice: number = shoePrice + deliveryPrice;
const thankYouMessage: string = "Thank you for your order!";

// Helper function for login
async function login(page: Page): Promise<void> {
  // Navigate to the login page using page.goto (not locator.goto)
  await page.goto(`${endpoint}ecommerce/login`);
  await page.getByRole("textbox", { name: /email/i }).fill(email);
  await page.getByRole("textbox", { name: /password/i }).fill(password);
  await page.locator("button", { hasText: /login/i }).click();
  // Wait until the product page is loaded after login
  await page.waitForRequest(`${endpoint}ecommerce?_rsc*`);
  await page.waitForRequest(`${endpoint}ecommerce/product-details*`);
  await expect(page.locator(".user-name")).toHaveText(email); // Verify the email is shown in the user name element
}

test.skip("E2E test - place order", async ({ page }) => {
  // Step 1: Login
  await login(page);

  // Step 2: Select product
  const productName: Locator = page.locator(".text-lg.block");
  const addToOrderButton: Locator = page.locator("button", {
    hasText: /add to cart/i,
  });
  const basketAmount: Locator = page.locator(".bg-qa-clr");

  const productCount: number = await productName.count();
  for (let i = 0; i < productCount; i++) {
    const productText: string | null = await productName.nth(i).textContent();
    // If product matches the desired shoe, click the "Add to Cart" button
    if (productText === shoeName) {
      await addToOrderButton.nth(i).click();
      break;
    }
  }

  // Step 3: Check the basket
  await expect(basketAmount).toHaveText("1"); // Expect the basket to have 1 item
  await expect(
    page.getByRole("button", { name: /remove from cart/i })
  ).toBeVisible(); // Check if the "Remove from Cart" button is visible
  await basketAmount.click();

  // Wait for the cart response to confirm it was added to the cart
  const cartResponse: Response = await page.waitForResponse(
    `${endpoint}ecommerce/cart*`
  );
  expect(cartResponse.status()).toBe(200); // Expect the cart API response to be 200 OK
  await page.waitForURL(`${endpoint}ecommerce/cart`);
  await expect(page).toHaveURL(`${endpoint}ecommerce/cart`);
  await expect(page.getByRole("heading", { name: shoeName })).toBeVisible(); // Verify the product is in the cart
  await expect(
    page.locator(".font-bold.text-lg.font-oswald").last()
  ).toContainText(`${shoePrice}`); // Verify the shoe price is correct

  // Step 4: Checkout process
  await page.getByRole("button", { name: /checkout/i }).click();
  await page.waitForURL(`${endpoint}ecommerce/checkout-info`);
  await expect(page).toHaveURL(`${endpoint}ecommerce/checkout-info`);
  await expect(
    page.locator(`.cursor-no-drop[value="${email}"]`)
  ).toBeDisabled(); // Ensure email is disabled during checkout

  // Step 5: Fill in checkout form
  await page.getByRole("textbox", { name: /ex. john/i }).fill(firstName); // Fill first name
  await page.getByRole("textbox", { name: /ex. doe/i }).fill(lastName); // Fill last name
  await expect(page.locator(`.form-control[value="${zipCode}"]`)).toHaveValue(
    `${zipCode}`
  ); // Verify zip code value
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 6: Review order
  await page.waitForURL(`${endpoint}ecommerce/checkout-overview`);
  await expect(page).toHaveURL(`${endpoint}ecommerce/checkout-overview`);
  await expect(page.locator("p.text-md").last()).toContainText(`${totalPrice}`); // Verify the total price

  // Step 7: Finish checkout
  await page.getByRole("button", { name: /finish/i }).click();
  await page.waitForURL(`${endpoint}ecommerce/checkout-complete`);
  await expect(page).toHaveURL(`${endpoint}ecommerce/checkout-complete`);
  await expect(
    page.getByRole("heading", { name: /thank you for your order!/i })
  ).toHaveText(thankYouMessage); // Verify the "Thank You" message is displayed
});
