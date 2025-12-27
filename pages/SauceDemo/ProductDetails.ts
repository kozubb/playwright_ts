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

  // Validate product price text
  public async validateProductPrice(expectedPrice: string): Promise<void> {
    await expect(this.productPrice).toHaveText(expectedPrice);
  }

  // #endregion
}
