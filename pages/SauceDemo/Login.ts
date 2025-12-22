import { Page, Locator, expect } from "@playwright/test";

export default class LoginPage {
  private page: Page;
  loginButton: Locator;

  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
    this.loginButton = this.page.getByRole("button", { name: /login/i });
  }

  // #region Actions on UI elements

  // Fill input field by input name and expected text
  public async fillInput(
    inputName: string,
    expectedText: string
  ): Promise<void> {
    await this.page
      .getByRole("textbox", { name: inputName })
      .fill(expectedText);
  }

  // Press login button
  public async pressLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  // #endregion

  // #region Validations on UI elements

  // Check if login button is visible on the page
  public async checkIfLoginButtonIsVisible(): Promise<void> {
    const loginButtonVisibility = await this.loginButton.isVisible();
    expect(loginButtonVisibility).toBeTruthy();
  }

  // #endregion
}
