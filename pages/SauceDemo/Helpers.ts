import LoginPage from "../../pages/SauceDemo/Login";
import { expect, Page } from "@playwright/test";

export default class Helpers {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Login into SauceDemo with given credentials
  async loginAs({
    endpoint,
    username,
    password,
  }: {
    endpoint: string;
    username: string;
    password: string;
  }) {
    const loginPage = new LoginPage(this.page);

    // Visit the login page
    await this.page.goto(endpoint);

    // Fill in username and password, then submit
    await loginPage.fillInput("username", username);
    await loginPage.fillInput("password", password);
    await loginPage.pressLoginButton();

    return this;
  }

  // Remove currency symbols from a string and return numeric part
  removeCurrencySymbol(text: string) {
    return text.replace(/[\$£€+]/g, "").trim();
  }

  // Remove numeric price and return only currency symbols
  removePrice(text: string) {
    return text.replace(/[0-9]+,?.[0-9]{2}/g, "").trim();
  }

  // Remove special characters and convert string to lowercase
  removeSpecialChars(text: string) {
    return text.replace(/[&\/\\#,+()~%_.'":*?<>{} ]/g, "").toLowerCase();
  }

  // Convert comma to dot and parse string to float
  changeCommaSign(text: string) {
    return parseFloat(text.trim().replace(",", "."));
  }

  // Validate that price and currency symbol match expected values
  priceValidator(
    currentPriceElement: string,
    expectedPriceValue: number,
    expectedCurrencySymbol: string
  ) {
    const expectedPriceAsNumberFixed = +expectedPriceValue.toFixed(2);
    const price = this.changeCommaSign(
      this.removeCurrencySymbol(currentPriceElement)
    );
    const currencySymbol = this.removeSpecialChars(
      this.removePrice(currentPriceElement)
    );

    // Assert that numeric price matches expected
    expect(price).toBeCloseTo(expectedPriceAsNumberFixed, 2);

    // Assert that currency symbol matches expected
    expect(currencySymbol).toBe(expectedCurrencySymbol);

    return this;
  }
}
