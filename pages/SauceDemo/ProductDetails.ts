import { Page, Locator, expect } from "@playwright/test";

// Page Object for Product Listing Page
export default class ProductListing {
  private page: Page;
  productTitle: Locator;
  productPrice: Locator;
  addToCartButton: Locator;
  removeButton: Locator;
  backButton: Locator;

  // Initialize locators
  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('[data-test="inventory-item-name"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  // #region Actions

  // Press "Add to Cart" button
  public async pressAddToCartButton(): Promise<void> {
    await this.addToCartButton.click();
  }

  // Press "Remove" button
  public async pressRemoveButton(): Promise<void> {
    await this.removeButton.click();
  }

  // Press "Back" button
  public async pressBackButton(): Promise<void> {
    await this.backButton.click();
  }

  // #endregion

  // #region Validations

  // Validate product title text
  public async validateProductTitle(productName: string): Promise<void> {
    await expect(this.productTitle).toHaveText(productName);
  }

  // Validate product price text, separate currency and numeric value
  public async validateProductPriceAndCurrency(
    expectedCurrency: string,
    expectedValue: number
  ): Promise<void> {
    // Get the text content of the price
    const priceText = await this.productPrice.textContent();

    if (!priceText) {
      throw new Error("Price text not found"); // Throw error if no text
    }

    // Extract currency symbol (e.g., $)
    const currencyMatch = priceText.match(/^[^\d]+/);
    if (!currencyMatch) {
      throw new Error(`Currency not found in price "${priceText}"`); // Throw if currency missing
    }

    // Extract numeric value (e.g., 9.99)
    const numberMatch = priceText.match(/[\d,.]+/);
    if (!numberMatch) {
      throw new Error(`Numeric value not found in price "${priceText}"`); // Throw if number missing
    }

    // Assert currency separately
    expect(currencyMatch[0]).toBe(expectedCurrency);

    // Assert numeric value separately
    expect(parseFloat(numberMatch[0].replace(",", ""))).toBe(expectedValue);
  }

  // Validate if remove item is visible after adding product to the cart
  public async valiateIfRemoveButtonIsVisible(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
  }

  // #endregion
}
