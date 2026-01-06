import { Page, expect } from '@playwright/test'

export default class ThankYouPage {
	private page: Page

	constructor(page: Page) {
		this.page = page
	}

	// #region Validations

	async validateThankYouMessage(message: string) {
		await expect(this.page.getByRole('heading', { name: /thank you for your order!/i })).toHaveText(message)
	}

	// #endregion
}
