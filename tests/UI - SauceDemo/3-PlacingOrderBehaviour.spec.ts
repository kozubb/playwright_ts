import { test } from "@playwright/test";
import Helpers from "../../pages/SauceDemo/Helpers";
import ProductListing from "../../pages/SauceDemo/ProductListing";
import Cart from "../../pages/SauceDemo/Cart";
import Checkout from "../../pages/SauceDemo/Checkout";
import Overview from "../../pages/SauceDemo/Overview";
import ThankYouPage from "../../pages/SauceDemo/ThankYouPage";
import testData from "../../testData/SauceDemo/TestData";

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
  await helpers.loginAs({
    endpoint: testData.Endpoint,
    username: testData.Users.StandardUser.Username,
    password: testData.Users.StandardUser.Password,
  });
  // Step 3: Verify inventory page is loaded and shopping cart icon is visible
  await page.waitForURL(`${testData.Endpoint}/inventory.html`);
  await productListing.validateIfCartIsVisible();

  // Step 4: Add products from listing page to cart
  await productListing.pressAddToOrderButton(testData.Products.Backpack.Name);
  await productListing.validateShoppingCartAmount("1"); // Validate 1 item in cart

  await productListing.pressAddToOrderButton(testData.Products.BikeLight.Name);
  await productListing.validateShoppingCartAmount("2"); // Validate 2 items in cart

  // Step 5: Open cart and validate product details
  await productListing.pressShoppingCartIcon();

  // Validate product titles
  await cart.validateProductTitleInBasket(
    testData.Products.Backpack.Id,
    testData.Products.Backpack.Name
  );
  await cart.validateProductTitleInBasket(
    testData.Products.BikeLight.Id,
    testData.Products.BikeLight.Name
  );

  // Validate product quantities
  await cart.validateProductQuantityInCart(0, "1");
  await cart.validateProductQuantityInCart(1, "1");

  // Validate product prices and currency
  await cart.validateProductPriceAndCurrencyInCart(
    0,
    testData.CurrencySymbol,
    testData.Products.Backpack.Price
  );
  await cart.validateProductPriceAndCurrencyInCart(
    1,
    testData.CurrencySymbol,
    testData.Products.BikeLight.Price
  );

  // Step 6: Proceed to checkout
  await cart.pressCheckoutButton();

  // Step 7: Fill in checkout information
  await checkout.fillCheckoutInput(
    testData.CheckoutForm.FirstNameText,
    testData.Users.OrderUser.FirstName
  );
  await checkout.fillCheckoutInput(
    testData.CheckoutForm.LastNameText,
    testData.Users.OrderUser.LastName
  );
  await checkout.fillCheckoutInput(
    testData.CheckoutForm.ZipcodeText,
    testData.Users.OrderUser.Zipcode
  );
  await checkout.pressContinueButton();

  // Step 8: Validate overview page details
  await overview.validatePaymentMethod(testData.PaymentMethod); // Payment method
  await overview.validateDeliveryMethod(testData.DeliveryMethod); // Shipping method
  await overview.validateSubtotal(
    testData.Products.Backpack.Price + testData.Products.BikeLight.Price,
    testData.CurrencySymbol
  ); // Subtotal
  await overview.validateTotalPrice(
    (testData.Products.Backpack.Price + testData.Products.BikeLight.Price) *
      testData.Tax +
      testData.Products.Backpack.Price +
      testData.Products.BikeLight.Price,
    testData.CurrencySymbol
  ); // Total price including testData.Tax

  // Step 9: Finish the order
  await overview.pressFinishButton();

  // Step 10: Validate Thank You page message
  await thankYou.validateThankYouText(testData.Messages.ThankYouMessage);
});
