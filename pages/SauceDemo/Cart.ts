import { Page, Locator, expect } from "@playwright/test";

export default class ProductListing {
  private page: Page;
  itemQuantity: Locator;
  checkoutButton: Locator;
  productPrice: Locator;
  continueShoppingButton: Locator;

  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
  }

  // #region Helpers on UI elements

  // Return locator product title in cart
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
  public async pressCheckoutButton(): Promise<void> {
    await this.checkoutButton.click();
  }

  // Press product title in cart
  public async pressProductTitle(productId: number): Promise<void> {
    await this.productTitleCart(productId).click();
  }

  // Press remove product button in cart
  public async pressRemoveProductButtonCart(
    productName: string
  ): Promise<void> {
    await this.removeProductButtonCart(productName).click();
  }

  // Press checkout button
  public async pressContinurShoppingButton(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  // #endregion

  // #region Validations on UI elements

  // Check product quantity by position
  public async validateProductQuantityInCart(
    position: number,
    quantity: string
  ): Promise<void> {
    await expect(this.itemQuantity.nth(position)).toHaveText(quantity);
  }

  // Check product title name by product id
  public async validateProductTitleInBasket(
    productId: number,
    productTitle: string
  ): Promise<void> {
    await expect(this.productTitleCart(productId)).toHaveText(productTitle);
  }

  // Check product price by position
  public async validateProductPriceInCart(
    position: number,
    price: string
  ): Promise<void> {
    await expect(this.productPrice.nth(position)).toHaveText(price);
  }

  // #endregion
}
