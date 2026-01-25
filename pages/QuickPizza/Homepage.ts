import { Page, Locator, expect } from '@playwright/test'

export default class Homepage {
	private page: Page
	pizzaButton: Locator
	recommendButton: Locator
	noThanksButton: Locator
	ratingMessage: Locator

	// Constructor to initialize the Page instance
	public constructor(page: Page) {
		this.page = page
		this.pizzaButton = this.page.getByRole('button', { name: /pizza, please!/i })
		this.recommendButton = this.page.getByRole('button', { name: /love it!/i })
		this.noThanksButton = this.page.getByRole('button', { name: /no thanks/i })
		this.ratingMessage = this.page.locator('#rate-result')
	}

	// #region Actions on UI elements

	// Press pizza button
	public async pressPizzaButton(): Promise<void> {
		await this.pizzaButton.click()
	}

	// Press 'love it' button
	public async pressRecommendButton(): Promise<void> {
		await this.recommendButton.click()
	}

	// Press 'no thanks' button
	public async pressNoThanksButton(): Promise<void> {
		await this.noThanksButton.click()
	}

	// #endregion

	// #region Validations on UI elements

	// Check if 'no thanks' button is visible on the page
	public async validateIfNoThanksIsVisible(): Promise<void> {
		const noThanksButtonVisibility = await this.noThanksButton.isVisible()
		expect(noThanksButtonVisibility).toBeTruthy()
	}
	// Check message after rating
	public async validateRatingMessage(expectedText: string): Promise<void> {
		await expect(this.ratingMessage).toHaveText(expectedText)
	}

	// #endregion
}
