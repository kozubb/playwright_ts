import { Page, Locator } from "@playwright/test";

export default class Checkout {
  private page: Page;
  continueButton: Locator;

  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
    this.continueButton = this.page.getByRole("button", { name: /continue/i });
  }

  // #region Actions on UI elements

  // Fill checkout input by input name and expected text
  public async fillCheckoutInput(
    inputName: string,
    expectedText: string
  ): Promise<void> {
    await this.page
      .getByRole("textbox", { name: inputName })
      .fill(expectedText);
  }

  // Press continue button
  public async pressContinueButton(): Promise<void> {
    await this.continueButton.click();
  }

  // #endregion

  // #region Validations on UI elements

  // #endregion
}
