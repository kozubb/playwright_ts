import { Page, expect } from '@playwright/test'

export default class Checkout {
	private page: Page

	constructor(page: Page) {
		this.page = page
	}

	// #region Actions

	// Fill first name field
	async fillFirstName(firstName: string): Promise<void> {
		await this.page.getByRole('textbox', { name: /ex. john/i }).fill(firstName)
	}

	// Fill last name field
	async fillLastName(lastName: string): Promise<void> {
		await this.page.getByRole('textbox', { name: /ex. doe/i }).fill(lastName)
	}

	// Click continue button
	async pressContinueButton(): Promise<void> {
		await this.page.getByRole('button', { name: /continue/i }).click()
	}

	// #region Validations
	// Validate zip code field value
	async validateZipCode(zipCode: number): Promise<void> {
		await expect(this.page.locator(`.form-control[value="${zipCode}"]`)).toHaveValue(`${zipCode}`)
	}
	// #endregion
}
