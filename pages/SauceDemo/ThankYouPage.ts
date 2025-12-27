import { Page, Locator, expect } from "@playwright/test";

export default class LoginPage {
  private page: Page;
  thankYouText: Locator;
  backHomeButton: Locator;

  // Initialize page locators
  public constructor(page: Page) {
    this.page = page;
    this.thankYouText = this.page.locator('[data-test="complete-header"]');
    this.backHomeButton = this.page.locator('[data-test="back-to-products"]');
  }

  // #region Actions

  // Click "Back Home" button
  public async pressBackHomeButton(): Promise<void> {
    await this.backHomeButton.click();
  }

  // #endregion

  // #region Validations

  // Validate "Thank You" page message text
  public async validateThankYouText(expectedText: string): Promise<void> {
    await expect(this.thankYouText).toHaveText(expectedText);
  }

  // #endregion
}
