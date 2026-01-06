import LoginPage from '../../pages/QABrains/Login'
import { expect, Page } from '@playwright/test'

export default class Helpers {
	page: Page

	constructor(page: Page) {
		this.page = page
	}

	// Login into SauceDemo with given credentials
	async loginAs({ endpoint, username, password }: { endpoint: string; username: string; password: string }) {
		const loginPage = new LoginPage(this.page)

		// Visit the login page
		await this.page.goto(endpoint)

		// Fill in username and password, then submit
		await loginPage.fillEmail(username)
		await loginPage.fillPassword(password)
		await loginPage.pressLoginButton()

		await expect(this.page.locator('.user-name')).toHaveText(username) // Verify the email is shown in the user name element

		return this
	}

	// Remove currency symbols from a string and return numeric part
	removeCurrencySymbol(text: string) {
		return text.replace(/[\$£€+]/g, '').trim()
	}

	// Remove numeric price and return only currency symbols
	removePrice(text: string) {
		return text.replace(/[0-9]+,?.[0-9]{2}/g, '').trim()
	}

	// Remove special characters and convert string to lowercase
	removeSpecialChars(text: string) {
		return text.replace(/[&\/\\#,+()~%_.'":*?<>{} ]/g, '').toLowerCase()
	}

	// Remove letters, colons, and spaces from a string
	removeLettersColonAndSpace(text: string): string {
		return text.replace(/[a-zA-Z:\s]/g, '')
	}

	// Convert comma to dot and parse string to float
	changeCommaSign(text: string) {
		return parseFloat(text.trim().replace(',', '.'))
	}

	// Validate that price and currency symbol match expected values
	priceValidator(currentPriceElement: string, expectedPriceValue: number, expectedCurrencySymbol: string) {
		const expectedPriceAsNumberFixed = +expectedPriceValue.toFixed(2)
		const priceWithoutLetters = this.removeLettersColonAndSpace(currentPriceElement)
		const price = this.changeCommaSign(this.removeCurrencySymbol(priceWithoutLetters))
		const currencySymbolWithoutLetters = this.removeLettersColonAndSpace(currentPriceElement)
		const currencySymbol = this.removeSpecialChars(this.removePrice(currencySymbolWithoutLetters))

		// Assert that numeric price matches expected
		expect(price).toBeCloseTo(expectedPriceAsNumberFixed, 2)

		// Assert that currency symbol matches expected
		expect(currencySymbol).toBe(expectedCurrencySymbol)

		return this
	}
}
