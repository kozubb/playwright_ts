import { Page, expect } from '@playwright/test'

export default class ProductListing {
	private page: Page

	constructor(page: Page) {
		this.page = page
	}

	// #region Actions

	async addProductToCart(productName: string) {
		const products = this.page.locator('.text-lg.block')
		const buttons = this.page.locator('button', { hasText: /add to cart/i })

		const count = await products.count()
		for (let i = 0; i < count; i++) {
			const name = await products.nth(i).textContent()
			if (name?.trim() === productName) {
				await buttons.nth(i).click()
				break
			}
		}
	}

	async openCart() {
		const basketAmount = this.page.locator('.bg-qa-clr')
		await basketAmount.click()
	}

	// #endregion
}
