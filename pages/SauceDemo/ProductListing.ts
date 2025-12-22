import { Page, Locator, expect } from "@playwright/test";

export default class ProductListing {
  private page: Page;
  shoppingCart: Locator;

  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
    this.shoppingCart = page.locator('[data-test="shopping-cart-link"]');
  }

  // #region Actions on UI elements

  // #endregion

  // #region Validations on UI elements

  // Check if login button is visible on the page
  public async checkIfCartIsVisible(): Promise<void> {
    await expect(this.shoppingCart).toBeVisible();
  }

  // #endregion
}
