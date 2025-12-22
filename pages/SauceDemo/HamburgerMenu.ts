import { Page, Locator, expect } from "@playwright/test";

export default class HamburgerMenu {
  private page: Page;
  // Constructor to initialize the Page instance
  public constructor(page: Page) {
    this.page = page;
  }

  // #region Actions on UI elements

  // Press at hamburger menu icon
  public async pressHamburgerMenuIcon(): Promise<void> {
    await this.page.getByRole("button", { name: /open menu/i }).click();
  }

  // Press at hamburger menu icon
  public async pressHamburgerMenuLogoutBtn(): Promise<void> {
    await this.page.getByRole("link", { name: /logout/i }).click();
  }

  // #endregion

  // #region Validations on UI elements

  // #endregion
}
