import { Page, Locator, expect } from "@playwright/test";

export default class ProductListing {
  private page: Page;
  shoppingCart: Locator;
  shoppingCartAmount: Locator;

  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
    this.shoppingCart = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartAmount = page.locator('[data-test="shopping-cart-badge"]');
  }

  // #region Helpers on UI elements

  // Return locator for add to order button
  addToOrderButton(productName: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productName}"]`);
  }

  // Return locator for remove product button
  removeProductButton(productName: string): Locator {
    return this.page.locator(`[data-test="remove-${productName}"]`);
  }

  // Return locator for product image for opening pdp
  productImage(productName: string): Locator {
    return this.page.locator(`[data-test="inventory-item-${productName}-img"]`);
  }

  // #endregion

  // #region Actions on UI elements

  // Press add to order button for specific product
  public async pressAddToOrderButton(productName: string): Promise<void> {
    await this.addToOrderButton(productName).click();
  }

  // Press remove product button for specific product
  public async pressRemoveProductButton(productName: string): Promise<void> {
    await this.removeProductButton(productName).click();
  }

  // Press product image for specific product
  public async pressProductImage(productName: string): Promise<void> {
    await this.productImage(productName).click();
  }

  // Press shopping cart icon
  public async pressShoppingCartIcon(): Promise<void> {
    await this.shoppingCart.click();
  }

  // #endregion

  // #region Validations on UI elements

  // Check if login button is visible on the page
  public async checkIfCartIsVisible(): Promise<void> {
    await expect(this.shoppingCart).toBeVisible();
  }

  // Check if remove button is visible for specific product
  public async checkIfRemoveButtonIsVisible(
    productName: string
  ): Promise<void> {
    await expect(this.removeProductButton(productName)).toBeVisible();
  }

  // Check shopping cart amount
  public async checkShoppingCartAmount(expectedNumber: string): Promise<void> {
    await expect(this.shoppingCartAmount).toHaveText(expectedNumber);
  }

  // #endregion
}
