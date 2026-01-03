import { Page, Locator, expect } from '@playwright/test'

export default class LoginPage {
	private page: Page
	loginButton: Locator
	errorMessage: Locator

	// Constructor to initialize the Page instance
	public constructor(page: Page) {
		this.page = page
		this.loginButton = this.page.getByRole('button', { name: /login/i })
		this.errorMessage = this.page.locator(`[data-test="error"]`)
	}

	// #region Actions on UI elements

	// Fill input field by input name and expected text
	public async fillInput(inputName: string, expectedText: string): Promise<void> {
		await this.page.getByRole('textbox', { name: inputName }).fill(expectedText)
	}

	// Press login button
	public async pressLoginButton(): Promise<void> {
		await this.loginButton.click()
	}

	// #endregion

	// #region Validations on UI elements

	// Check if login button is visible on the page
	public async validateIfLoginButtonIsVisible(): Promise<void> {
		const loginButtonVisibility = await this.loginButton.isVisible()
		expect(loginButtonVisibility).toBeTruthy()
	}

	// Check login error message
	public async validateLoginErrorMessage(expectedText: string): Promise<void> {
		await this.errorMessage.isVisible()
		await expect(this.errorMessage).toContainText(expectedText)
	}

	// Check visibility of login error message
	public async validateIfLoginErrorMessageIsVisible(visible: boolean = true): Promise<void> {
		if (visible) {
			await expect(this.errorMessage).toBeVisible()
		} else {
			await expect(this.errorMessage).toBeHidden()
		}
	}

	// #endregion
}
