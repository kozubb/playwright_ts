import { Page, Locator, expect } from "@playwright/test";
import Helpers from "./Helpers";

export default class Overview {
  private page: Page;
  helpers: Helpers;
  paymentMethod: Locator;
  deliveryMethod: Locator;
  subtotalPrice: Locator;
  taxPrice: Locator;
  totalPrice: Locator;
  finishButton: Locator;

  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
    this.helpers = new Helpers(page);
    this.paymentMethod = page.locator('[data-test="payment-info-value"]');
    this.deliveryMethod = page.locator('[data-test="shipping-info-value"]');
    this.subtotalPrice = page.locator('[data-test="subtotal-label"]');
    this.taxPrice = page.locator('[data-test="tax-label"]');
    this.totalPrice = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  // #region Actions on UI elements

  // Press finish button
  public async pressFinishButton(): Promise<void> {
    await this.finishButton.click();
  }

  // #endregion

  // #region Validations on UI elements

  // Check payment method
  public async validatePaymentMethod(expectedText: string): Promise<void> {
    await expect(this.paymentMethod).toHaveText(expectedText);
  }

  // Check delivery method
  public async validateDeliveryMethod(expectedText: string): Promise<void> {
    await expect(this.deliveryMethod).toHaveText(expectedText);
  }

  // Validate subtotal price (currency + numeric value)
  async validateSubtotal(
    expectedPrice: number,
    currency: string
  ): Promise<this> {
    const subtotalPriceText = await this.subtotalPrice.textContent();
    if (!subtotalPriceText) throw new Error("Product price not found");
    this.helpers.priceValidator(subtotalPriceText, expectedPrice, currency);
    return this;
  }

  // Validate total price, check currency
  async validateTotalPrice(
    expectedPrice: number,
    currencySymbol: string
  ): Promise<this> {
    const totalPriceText = await this.totalPrice.textContent();
    if (!totalPriceText) throw new Error("Product price not found");

    this.helpers.priceValidator(totalPriceText, expectedPrice, currencySymbol);
    return this;
  }
  // #endregion
}
