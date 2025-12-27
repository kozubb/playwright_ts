import { test } from "@playwright/test";
import { loginAs } from "../../pages/SauceDemo/Helpers/LogisAs";
import ProductListing from "../../pages/SauceDemo/ProductListing";
import Cart from "../../pages/SauceDemo/Cart";
import ProductDetails from "../../pages/SauceDemo/ProductDetails";

// Test data – endpoint, credentials, and products
const endpoint: string = "https://www.saucedemo.com";
const username: string = "standard_user"; // Valid username
const password: string = "secret_sauce"; // Valid password

const productBackpackName = "Sauce Labs Backpack";
const productBikeLightName = "Sauce Labs Bike Light";

const productBikeLightId = 0;
const productBackpackId = 4;

const productBackpackPrice = 29.99;
const productBikeLightPrice = 9.99;
const currency = "$";

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

  await cart.validateProductPriceInCartSeparate(
    0,
    currency,
    productBackpackPrice
  );
  await cart.validateProductPriceInCartSeparate(
    1,
    currency,
    productBikeLightPrice
  );
});

// E2E test: Add products to the cart and verify cart content
test("Add products from PDP to cart and verify cart details", async ({
  page,
}) => {
  // Step 1: Log in as standard user
  await loginAs(page, {
    endpoint,
    username,
    password,
  });

  // Step 2: Initialize page objects
  const productListing = new ProductListing(page);
  const cart = new Cart(page);
  const productDetails = new ProductDetails(page);

  // Step 3: Verify inventory page is loaded
  await page.waitForURL(`${endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add products to the cart from product details page
  await productListing.pressProductImage(productBackpackName);
  await page.waitForURL(
    `${endpoint}/inventory-item.html?id=${productBackpackId}`
  );
  await productDetails.validateProductTitle(productBackpackName);
  await productDetails.validateProductPriceAndCurrency(
    currency,
    productBackpackPrice
  );
  await productDetails.pressAddToCartButton();
  await productListing.validateShoppingCartAmount("1");
  await productDetails.pressBackButton();

  // Step 4: Add products to the cart from product details page
  await productListing.pressProductImage(productBikeLightName);
  await page.waitForURL(
    `${endpoint}/inventory-item.html?id=${productBikeLightId}`
  );
  await productDetails.validateProductTitle(productBikeLightName);
  await productDetails.validateProductPriceAndCurrency(
    currency,
    productBikeLightPrice
  );
  await productDetails.pressAddToCartButton();
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

  await cart.validateProductPriceInCartSeparate(
    0,
    currency,
    productBackpackPrice
  );
  await cart.validateProductPriceInCartSeparate(
    1,
    currency,
    productBikeLightPrice
  );
});

// E2E test: Add products from PDP and PLP and verify no duplicate add possible
test("Add products from PDP and from PLP and verify that there is no possibility to add the same product once again", async ({
  page,
}) => {
  // Step 1: Log in as standard user
  await loginAs(page, { endpoint, username, password });

  // Step 2: Initialize page objects
  const productListing = new ProductListing(page);
  const cart = new Cart(page);
  const productDetails = new ProductDetails(page);

  // Step 3: Verify inventory page is loaded and cart is visible
  await page.waitForURL(`${endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add productBackpack from PDP
  await productListing.pressProductImage(productBackpackName); // Open PDP
  await page.waitForURL(
    `${endpoint}/inventory-item.html?id=${productBackpackId}`
  );
  await productDetails.validateProductTitle(productBackpackName); // Validate title
  await productDetails.validateProductPriceAndCurrency(
    currency,
    productBackpackPrice
  ); // Validate price
  await productDetails.pressAddToCartButton(); // Add to cart
  await productListing.validateShoppingCartAmount("1"); // Validate cart count
  await productDetails.valiateIfRemoveButtonIsVisible(); // Validate "Remove" button
  await productDetails.pressBackButton(); // Go back to listing page

  // Step 5: Verify "Add to Cart" button is disabled / product cannot be added again
  await productListing.validateIfRemoveButtonIsVisible(productBackpackName); // Check cannot add again

  // Step 6: Add productBikeLight from PLP
  await productListing.pressAddToOrderButton(productBikeLightName); // Add from listing
  await productListing.validateShoppingCartAmount("2"); // Validate cart count
  await productListing.validateIfRemoveButtonIsVisible(productBikeLightName); // Validate "Remove" button

  // Step 7: Verify "Add to Cart" button is disabled for productBikeLight
  await productListing.validateIfRemoveButtonIsVisible(productBikeLightName); // Check cannot add again
});
