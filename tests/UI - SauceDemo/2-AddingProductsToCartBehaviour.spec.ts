import { test } from "@playwright/test";
import { loginAs } from "../../pages/SauceDemo/Helpers/LogisAs";
import ProductListing from "../../pages/SauceDemo/ProductListing";
import Cart from "../../pages/SauceDemo/Cart";

// Test data – endpoint, credentials, and products
const endpoint: string = "https://www.saucedemo.com";
const username: string = "standard_user"; // Valid username
const password: string = "secret_sauce"; // Valid password

const productBackpackName = "Sauce Labs Backpack";
const productBikeLightName = "Sauce Labs Bike Light";

const productBikeLightId = 0;
const productBackpackId = 4;

const productBackpackPrice = "$9.99";
const productBikeLightPrice = "$29.99";

// E2E test: Add products to the cart and verify cart content
test("Add products to cart and verify cart details", async ({ page }) => {
  // Step 1: Log in as standard user
  await loginAs(page, {
    endpoint,
    username,
    password,
  });

  // Step 2: Initialize page objects
  const productListing = new ProductListing(page);
  const cart = new Cart(page);

  // Step 3: Verify inventory page is loaded
  await page.waitForURL(`${endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add products to the cart
  await productListing.pressAddToOrderButton(productBackpackName);
  await productListing.validateShoppingCartAmount("1");

  await productListing.pressAddToOrderButton(productBikeLightName);
  await productListing.validateShoppingCartAmount("2");

  // Step 5: Open cart and verify product details
  await productListing.pressShoppingCartIcon();

  await cart.validateProductTitleInBasket(
    productBackpackId,
    productBackpackName
  );
  await cart.validateProductTitleInBasket(
    productBikeLightId,
    productBikeLightName
  );

  await cart.validateProductQuantityInCart(0, "1");
  await cart.validateProductQuantityInCart(1, "1");

  await cart.validateProductPriceInCart(0, productBikeLightPrice);
  await cart.validateProductPriceInCart(1, productBackpackPrice);
});
