import { test } from "@playwright/test";
import Helpers from "../../pages/SauceDemo/Helpers";
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

// E2E test: Add products from listing page and verify cart content
test("Add products to cart and verify cart details", async ({ page }) => {
  // Step 1: Initialize page objects
  const productListing = new ProductListing(page);
  const cart = new Cart(page);
  const helpers = new Helpers(page);

  // Step 2: Log in as standard user
  await helpers.loginAs({ endpoint, username, password });

  // Step 3: Verify inventory page is loaded
  await page.waitForURL(`${endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add products from listing page
  await productListing.pressAddToOrderButton(productBackpackName);
  await productListing.validateShoppingCartAmount("1");

  await productListing.pressAddToOrderButton(productBikeLightName);
  await productListing.validateShoppingCartAmount("2");

  // Step 5: Open cart and validate product details
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

  await cart.validateProductPriceAndCurrencyInCart(
    0,
    currency,
    productBackpackPrice
  );
  await cart.validateProductPriceAndCurrencyInCart(
    1,
    currency,
    productBikeLightPrice
  );
});

// E2E test: Add products from PDP and verify cart content
test("Add products from PDP to cart and verify cart details", async ({
  page,
}) => {
  // Step 1: Initialize page objects
  const productListing = new ProductListing(page);
  const cart = new Cart(page);
  const productDetails = new ProductDetails(page);
  const helpers = new Helpers(page);

  // Step 2: Log in as standard user
  await helpers.loginAs({ endpoint, username, password });

  // Step 3: Verify inventory page is loaded
  await page.waitForURL(`${endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add productBackpack from PDP
  await productListing.pressProductImage(productBackpackName);
  await page.waitForURL(
    `${endpoint}/inventory-item.html?id=${productBackpackId}`
  );
  await productDetails.validateProductTitle(productBackpackName);
  await productDetails.validateProductPrice(productBackpackPrice, currency);
  await productDetails.pressAddToCartButton();
  await productListing.validateShoppingCartAmount("1");
  await productDetails.pressBackButton();

  // Step 5: Add productBikeLight from PDP
  await productListing.pressProductImage(productBikeLightName);
  await page.waitForURL(
    `${endpoint}/inventory-item.html?id=${productBikeLightId}`
  );
  await productDetails.validateProductTitle(productBikeLightName);
  await productDetails.validateProductPrice(productBikeLightPrice, currency);
  await productDetails.pressAddToCartButton();
  await productListing.validateShoppingCartAmount("2");

  // Step 6: Open cart and validate product details
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

  await cart.validateProductPriceAndCurrencyInCart(
    0,
    currency,
    productBackpackPrice
  );
  await cart.validateProductPriceAndCurrencyInCart(
    1,
    currency,
    productBikeLightPrice
  );
});

// E2E test: Prevent duplicate adding of same product
test("Add products from PDP and PLP and verify duplicate add is not possible", async ({
  page,
}) => {
  // Step 1: Initialize page objects
  const productListing = new ProductListing(page);
  const cart = new Cart(page);
  const productDetails = new ProductDetails(page);
  const helpers = new Helpers(page);

  // Step 2: Log in as standard user
  await helpers.loginAs({ endpoint, username, password });

  // Step 3: Verify inventory page is loaded
  await page.waitForURL(`${endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add productBackpack from PDP
  await productListing.pressProductImage(productBackpackName);
  await page.waitForURL(
    `${endpoint}/inventory-item.html?id=${productBackpackId}`
  );
  await productDetails.validateProductTitle(productBackpackName);
  await productDetails.validateProductPrice(productBackpackPrice, currency);
  await productDetails.pressAddToCartButton();
  await productListing.validateShoppingCartAmount("1");
  await productDetails.validateIfRemoveButtonIsVisible();
  await productDetails.pressBackButton();

  // Step 5: Verify "Add to Cart" button is disabled for productBackpack
  await productListing.validateIfRemoveButtonIsVisible(productBackpackName);

  // Step 6: Add productBikeLight from PLP
  await productListing.pressAddToOrderButton(productBikeLightName);
  await productListing.validateShoppingCartAmount("2");
  await productListing.validateIfRemoveButtonIsVisible(productBikeLightName);

  // Step 7: Verify "Add to Cart" button is disabled for productBikeLight
  await productListing.validateIfRemoveButtonIsVisible(productBikeLightName);
});
