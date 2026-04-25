import { Locator, Page, expect } from '@playwright/test'
import Helpers from './Helpers'

export default class ProductListing {
	private page: Page
	private products: Locator
	private productsPrice: Locator
	helpers: Helpers

	constructor(page: Page) {
		this.page = page
		this.products = this.page.locator('.text-lg.block')
		this.productsPrice = this.page.locator('.text-lg.font-bold ')
		this.helpers = new Helpers(page)
	}

	// #region Actions

	async addProductToCart(productName: string): Promise<void> {
		const buttons = this.page.locator('button', { hasText: /add to cart/i })

		const count = await this.products.count()
		for (let i = 0; i < count; i++) {
			const name = await this.products.nth(i).textContent()
			if (name?.trim() === productName) {
				await buttons.nth(i).click()
				break
			}
		}
	}

	async openCart(): Promise<void> {
		const basketAmount = this.page.locator('.bg-qa-clr')
		await basketAmount.click()
	}

	async pressSortingButton() {
		await this.page.locator('[data-slot="popover-trigger"]').click()
	}

	async pressSortingOptionByName(optionName: string) {
		await this.page.getByRole('option', { name: optionName }).click()
	}

	// #endregion

	// region Validations

	async validateSortingState(sortingState: string): Promise<void> {
		expect(this.page.getByRole('combobox', { name: sortingState })).toBeTruthy()
	}

	async validateFirstOrLastProductName(firstPosition: boolean = true, expectedName: string) {
		const product = firstPosition ? this.products.first() : this.products.last()

		await expect(product).toHaveText(expectedName)
	}

	async validateFirstOrLastProductPrice(
		firstPosition: boolean = true,
		expectedPrice: number,
		currencySymbol: string
	) {
		const productPricePosition = firstPosition ? this.productsPrice.first() : this.productsPrice.last()

		const priceText = await productPricePosition.textContent()

		if (!priceText) {
			throw new Error('Price text is null or empty')
		}

		this.helpers.priceValidator(priceText, expectedPrice, currencySymbol)
	}

	// #endregion
}
