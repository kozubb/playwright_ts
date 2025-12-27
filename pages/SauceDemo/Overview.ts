import { Page, Locator, expect } from "@playwright/test";

export default class ProductListing {
  private page: Page;
  paymentMethod: Locator;
  deliveryMethod: Locator;
  subtotalPrice: Locator;
  taxPrice: Locator;
  totalPrice: Locator;
  finishButton: Locator;

  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
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

  // Validate subtotal price by separating currency and numeric value
  public async validateSubtotal(
    expectedCurrency: string,
    expectedSubtotal: number
  ): Promise<void> {
    // Get the text of the subtotal element
    const subtotalText = await this.page
      .locator('[data-test="subtotal"]')
      .textContent();

    if (!subtotalText) {
      throw new Error("Subtotal text not found");
    }

    // Extract currency symbol
    const currencyMatch = subtotalText.match(/^[^\d]+/);
    if (!currencyMatch) {
      throw new Error(`Currency not found in subtotal "${subtotalText}"`);
    }

    // Extract numeric value
    const numberMatch = subtotalText.match(/[\d,.]+/);
    if (!numberMatch) {
      throw new Error(`Numeric value not found in subtotal "${subtotalText}"`);
    }

    // Assert currency
    expect(currencyMatch[0]).toBe(expectedCurrency);

    // Assert numeric value (convert string to float)
    expect(parseFloat(numberMatch[0].replace(",", ""))).toBeCloseTo(
      expectedSubtotal,
      2
    );
  }

  public async validateTotalFromSubtotalAndTax(): Promise<void> {
    // Get subtotal, tax, and total texts
    const subtotalText = (await this.subtotalPrice.textContent()) ?? "";
    const taxText = (await this.taxPrice.textContent()) ?? "";
    const totalText = (await this.totalPrice.textContent()) ?? "";

    if (!subtotalText || !taxText || !totalText) {
      throw new Error("Subtotal, tax, or total text not found");
    }

    // Extract currency symbols
    const subtotalCurrency = subtotalText.match(/^[^\d]+/)?.[0] ?? "";
    const taxCurrency = taxText.match(/^[^\d]+/)?.[0] ?? "";
    const totalCurrency = totalText.match(/^[^\d]+/)?.[0] ?? "";

    if (!subtotalCurrency || !taxCurrency || !totalCurrency) {
      throw new Error("Currency not found in subtotal, tax, or total");
    }

    // Assert currencies are consistent
    expect(subtotalCurrency).toBe(taxCurrency);
    expect(subtotalCurrency).toBe(totalCurrency);

    // Extract numeric values safely
    const subtotalValue = parseFloat(subtotalText.match(/[\d,.]+/)?.[0] ?? "0");
    const taxValue = parseFloat(taxText.match(/[\d,.]+/)?.[0] ?? "0");
    const totalValue = parseFloat(totalText.match(/[\d,.]+/)?.[0] ?? "0");

    // Assert total equals subtotal + tax
    expect(totalValue).toBeCloseTo(subtotalValue + taxValue, 2);
  }

  // #endregion
}
