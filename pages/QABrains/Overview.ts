import { Page, expect } from '@playwright/test'
import Helpers from './Helpers'

export default class Overview {
	private page: Page
	helpers: Helpers

	constructor(page: Page) {
		this.page = page
		this.helpers = new Helpers(page)
	}

	// #region Validations

	// Validate that the total price and currency in the overview matches expected price
	async validateTotalPriceAndCurrencyInOverview(currencySymbol: string, expectedPrice: number): Promise<void> {
		const priceElement = this.page.locator('p.text-md').last()
		const priceText = await priceElement.textContent()

		if (!priceText) throw new Error(`Price not found`)

		// Use Helpers to validate numeric price and currency symbol
		this.helpers.priceValidator(priceText, expectedPrice, currencySymbol)
	}

	// #endregion

	// #region Actions

	async finishOrder(): Promise<void> {
		await this.page.getByRole('button', { name: /finish/i }).click()
		await this.page.waitForURL(/checkout-complete/)
	}

	// #endregion
}
