import { Page, Locator, expect } from "@playwright/test";
import Helpers from "./Helpers";

export default class ProductDetails {
  private page: Page;
  helpers: Helpers;
  addToCartButton: Locator;
  removeButton: Locator;
  backButton: Locator;
  productTitle: Locator;
  productPrice: Locator;

  // Constructor to initialize locators and helpers
  constructor(page: Page) {
    this.page = page;
    this.helpers = new Helpers(page);
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.productTitle = page.locator('[data-test="inventory-item-name"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
  }

  // #region Actions

  // Click "Add to Cart" button
  async pressAddToCartButton(): Promise<void> {
    await this.addToCartButton.click();
  }

  // Click "Remove" button
  async pressRemoveButton(): Promise<void> {
    await this.removeButton.click();
  }

  // Click "Back to Products" button
  async pressBackButton(): Promise<void> {
    await this.backButton.click();
  }

  // #endregion

  // #region Validations

  // Validate product title text
  async validateProductTitle(expectedTitle: string): Promise<void> {
    await expect(this.productTitle).toHaveText(expectedTitle);
  }

  // Validate product price text (numeric + currency)
  async validateProductPrice(
    expectedPrice: number,
    currencySymbol: string
  ): Promise<void> {
    const priceText = await this.productPrice.textContent();
    if (!priceText) throw new Error("Product price not found");

    // Use Helpers to validate numeric price and currency symbol
    this.helpers.priceValidator(priceText, expectedPrice, currencySymbol);
  }

  // Validate if "Remove" button is visible
  async validateIfRemoveButtonIsVisible(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
  }

  // #endregion
}
