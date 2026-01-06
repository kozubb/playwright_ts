import { Page, Locator, expect } from '@playwright/test'

export default class LoginPage {
	private page: Page

	// Locators
	private loginButton: Locator
	private logoutButton: Locator
	private emailInput: Locator
	private passwordInput: Locator
	private successMessage: Locator

	constructor(page: Page) {
		this.page = page
		this.loginButton = page.getByRole('button', { name: /login/i })
		this.logoutButton = page.getByRole('button', { name: /logout/i })
		this.emailInput = page.getByRole('textbox', { name: /email/i })
		this.passwordInput = page.getByRole('textbox', { name: /password/i })
		this.successMessage = page.getByRole('heading', {
			name: /login successful/i
		})
	}

	// #region Actions

	async fillEmail(email: string): Promise<void> {
		await this.emailInput.fill(email)
	}

	async fillPassword(password: string): Promise<void> {
		await this.passwordInput.fill(password)
	}

	async pressLoginButton(): Promise<void> {
		await this.loginButton.click()
	}

	async pressLogoutButton(): Promise<void> {
		await this.logoutButton.click()
	}

	// #endregion

	// #region Validations

	async validateLoginSuccessMessage(expectedText: string): Promise<void> {
		await expect(this.successMessage).toHaveText(expectedText)
	}

	async validateLoginButtonVisible(): Promise<void> {
		await expect(this.loginButton).toBeVisible()
	}

	async validateLogoutButtonVisible(): Promise<void> {
		await expect(this.logoutButton).toBeVisible()
	}

	// #endregion
}
