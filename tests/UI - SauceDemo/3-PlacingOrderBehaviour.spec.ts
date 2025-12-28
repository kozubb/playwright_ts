import { test } from "@playwright/test";
import Helpers from "../../pages/SauceDemo/Helpers";
import ProductListing from "../../pages/SauceDemo/ProductListing";
import Cart from "../../pages/SauceDemo/Cart";
import Checkout from "../../pages/SauceDemo/Checkout";
import Overview from "../../pages/SauceDemo/Overview";
import ThankYouPage from "../../pages/SauceDemo/ThankYouPage";

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
const tax = 0.08;

const firstNameText = "First Name";
const expectedFirstName = "Test First Name";
const lastNameText = "Last Name";
const expectedLastName = "Test Last Name";
const zipCodeName = "Zip/Postal Code";
const expectedZipCodeName = "11111";

const paymentMethod = "SauceCard #31337";
const deliveryMethod = "Free Pony Express Delivery!";

const thankYouMessage = "Thank you for your order!";

// E2E test: Place an order from product listing to Thank You page
test("Place order", async ({ page }) => {
  // Step 1: Initialize all page objects
  const productListing = new ProductListing(page);
  const cart = new Cart(page);
  const helpers = new Helpers(page);
  const checkout = new Checkout(page);
  const overview = new Overview(page);
  const thankYou = new ThankYouPage(page);

  // Step 2: Log in as standard user
  await helpers.loginAs({ endpoint, username, password });

  // Step 3: Verify inventory page is loaded and shopping cart icon is visible
  await page.waitForURL(`${endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add products from listing page to cart
  await productListing.pressAddToOrderButton(productBackpackName);
  await productListing.validateShoppingCartAmount("1"); // Validate 1 item in cart

  await productListing.pressAddToOrderButton(productBikeLightName);
  await productListing.validateShoppingCartAmount("2"); // Validate 2 items in cart

  // Step 5: Open cart and validate product details
  await productListing.pressShoppingCartIcon();

  // Validate product titles
  await cart.validateProductTitleInBasket(
    productBackpackId,
    productBackpackName
  );
  await cart.validateProductTitleInBasket(
    productBikeLightId,
    productBikeLightName
  );

  // Validate product quantities
  await cart.validateProductQuantityInCart(0, "1");
  await cart.validateProductQuantityInCart(1, "1");

  // Validate product prices and currency
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

  // Step 6: Proceed to checkout
  await cart.pressCheckoutButton();

  // Step 7: Fill in checkout information
  await checkout.fillCheckoutInput(firstNameText, expectedFirstName);
  await checkout.fillCheckoutInput(lastNameText, expectedLastName);
  await checkout.fillCheckoutInput(zipCodeName, expectedZipCodeName);
  await checkout.pressContinueButton();

  // Step 8: Validate overview page details
  await overview.validatePaymentMethod(paymentMethod); // Payment method
  await overview.validateDeliveryMethod(deliveryMethod); // Shipping method
  await overview.validateSubtotal(
    productBackpackPrice + productBikeLightPrice,
    currency
  ); // Subtotal
  await overview.validateTotalPrice(
    (productBackpackPrice + productBikeLightPrice) * tax +
      productBackpackPrice +
      productBikeLightPrice,
    currency
  ); // Total price including tax

  // Step 9: Finish the order
  await overview.pressFinishButton();

  // Step 10: Validate Thank You page message
  await thankYou.validateThankYouText(thankYouMessage);
});
