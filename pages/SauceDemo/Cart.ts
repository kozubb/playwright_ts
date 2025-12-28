import { Page, Locator, expect } from "@playwright/test";
import Helpers from "./Helpers";

export default class Cart {
  private page: Page;
  private itemQuantity: Locator;
  private checkoutButton: Locator;
  private productPrice: Locator;
  private continueShoppingButton: Locator;
  private helpers: Helpers;

  // Constructor to initialize the Page instance and helpers
  constructor(page: Page) {
    this.page = page;
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
    this.helpers = new Helpers(page);
  }

  // #region Helpers on UI elements

  // Return locator for product title in cart
  productTitleCart(productId: number): Locator {
    return this.page.locator(`[data-test="item-${productId}-title-link"]`);
  }

  // Return locator for remove product button in cart
  removeProductButtonCart(productName: string): Locator {
    return this.page.locator(`[data-test="remove-${productName}"]`);
  }

  // #endregion

  // #region Actions on UI elements

  // Press checkout button
  async pressCheckoutButton(): Promise<void> {
    await this.checkoutButton.click();
  }

  // Click product title in cart
  async pressProductTitle(productId: number): Promise<void> {
    await this.productTitleCart(productId).click();
  }

  // Press remove product button in cart
  async pressRemoveProductButtonCart(productName: string): Promise<void> {
    await this.removeProductButtonCart(productName).click();
  }

  // Press continue shopping button
  async pressContinueShoppingButton(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  // #endregion

  // #region Validations on UI elements

  // Validate product quantity by position
  async validateProductQuantityInCart(
    position: number,
    quantity: string
  ): Promise<void> {
    await expect(this.itemQuantity.nth(position)).toHaveText(quantity);
  }

  // Validate product title by product id
  async validateProductTitleInBasket(
    productId: number,
    productTitle: string
  ): Promise<void> {
    await expect(this.productTitleCart(productId)).toHaveText(productTitle);
  }

  // Validate product price in cart by position, validating currency and numeric value
  async validateProductPriceAndCurrencyInCart(
    position: number,
    currencySymbol: string,
    expectedPrice: number
  ): Promise<void> {
    const priceElement = this.productPrice.nth(position);
    const priceText = await priceElement.textContent();

    if (!priceText) throw new Error(`Price not found at position ${position}`);

    // Use Helpers to validate numeric price and currency symbol
    this.helpers.priceValidator(priceText, expectedPrice, currencySymbol);
  }

  // #endregion
}
