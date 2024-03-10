import { test, expect } from "@playwright/test";

test("Customize product and add to the basket", async ({ page }) => {
  const endpoint: string = "https://qa7-www.solutions4delivery.com";
  const pizzaName: string = "Hiawatha";
  const defaultPizzaPrice: string = "14.50";
  const defaultPizzaOption: string = "Regular - Large (14 inch) ";
  const toppingName: string[] = [
    "Ham",
    "Beefballs",
    "Extra Mozzarella",
    "Mushroom",
    "Peppers",
    "Pineapple",
  ];
  const selectedTopings: any = page.getByTestId("chip-text");
  const newPizzaOption: string = "Thick - Medium (11.5 inch) ";
  const newPizzaPrice: string = "17.75";
  const buttonLocator: any = page.getByTestId("pdp-back-btn");
  const buttonLocatorV2: any = page.getByTestId("pdp-back-btn-v2");

  await page.goto(endpoint);
  await page.locator(".s4d-close-cookie").click();
  await page
    .locator(
      `
      .s4d-product-image [data-product-id="15"]`
    )
    .click();
  await expect(page.getByTestId("product-title")).toHaveText(pizzaName);
  await expect(page.getByTestId("product-subtitle")).toHaveText(
    defaultPizzaOption
  );
  await expect(page.getByTestId("pdp-price").first()).toHaveText(
    defaultPizzaPrice
  );
  await page.getByTestId("base-thick-btn").click();
  await page.getByTestId("size-medium115inch-selected").click();
  await page.getByTestId("sauce-bbqsauce-container").click();
  await page.getByTestId("pdp-btn-edit-ingredients").click();
  await page.getByTestId("pot-price-beefballs-btn-increase").click();
  await page.getByTestId("category-vegetable-picker-tile").click();
  await page.getByTestId("pot-price-peppers-btn-increase").click();
  await page.getByTestId("pot-price-mushroom-btn-increase").click();
  await page.getByTestId("drawer-footer-primary-btn").click();
  for (let i = 0; i < toppingName.length; i++) {
    await expect(selectedTopings.nth(i)).toHaveText(toppingName[i]);
  }
  await expect(page.getByTestId("product-subtitle")).toHaveText(newPizzaOption);
  await expect(page.getByTestId("pdp-price").first()).toHaveText(newPizzaPrice);
  await page.getByTestId("pdp-btn-buy-content").first().click();
  await expect(page.getByTestId("pdp-price").first()).toHaveText(
    defaultPizzaPrice
  );
  (await buttonLocator.isVisible())
    ? await buttonLocator.click()
    : await buttonLocatorV2.click();
});
