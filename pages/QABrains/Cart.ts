import { Page, expect } from '@playwright/test'
import Helpers from './Helpers'

export default class Cart {
	private page: Page
	helpers: Helpers

	constructor(page: Page) {
		this.page = page
		this.helpers = new Helpers(page)
	}

	// #region Actions

	async checkout(): Promise<void> {
		await this.page.getByRole('button', { name: /checkout/i }).click()
		await this.page.waitForURL(/checkout-info/)
	}

	// #endregion

	// #region Validations

	// Validate that the product price and currency in the cart matches expected price
	async validateProductPriceAndCurrencyInCart(currencySymbol: string, expectedPrice: number): Promise<void> {
		const priceElement = this.page.locator('.font-bold.text-lg.font-oswald').last()
		const priceText = await priceElement.textContent()

		if (!priceText) throw new Error(`Price not found`)

		// Use Helpers to validate numeric price and currency symbol
		this.helpers.priceValidator(priceText, expectedPrice, currencySymbol)
	}

	async validateProductInCart(productName: string): Promise<void> {
		await expect(this.page.getByRole('heading', { name: productName })).toBeVisible()
	}

	// #endregion
}
