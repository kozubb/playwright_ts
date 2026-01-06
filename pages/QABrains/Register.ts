import { Page, Locator, expect } from '@playwright/test'
import { RegisterDto } from '../../tests/UI - QA Brains/registerForm.dto'

export default class RegisterPage {
	private page: Page

	// Locators
	private nameInput: Locator
	private countrySelect: Locator
	private accountTypeSelect: Locator
	private emailInput: Locator
	private passwordInput: Locator
	private confirmPasswordInput: Locator
	private signupButton: Locator
	private successMessage: Locator

	constructor(page: Page) {
		this.page = page

		this.nameInput = page.getByRole('textbox', { name: /name/i })
		this.countrySelect = page.getByRole('combobox', {
			name: /select country/i
		})
		this.accountTypeSelect = page.getByRole('combobox', {
			name: /account type/i
		})
		this.emailInput = page.getByRole('textbox', { name: /email/i })
		this.passwordInput = page.getByRole('textbox', { name: /password/i }).first()
		this.confirmPasswordInput = page.getByRole('textbox', {
			name: /confirm password/i
		})
		this.signupButton = page.getByRole('button', { name: /signup/i })
		this.successMessage = page.getByRole('heading', {
			name: /registration successful/i
		})
	}

	// #region Actions

	async open(endpoint: string): Promise<void> {
		await this.page.goto(`${endpoint}registration`)
	}

	async fillRegisterForm(data: RegisterDto): Promise<void> {
		await this.nameInput.fill(data.name)
		await this.countrySelect.selectOption(data.country)
		await this.accountTypeSelect.selectOption(data.accountType)
		await this.emailInput.fill(data.email)
		await this.passwordInput.fill(data.password)
		await this.confirmPasswordInput.fill(data.password)
	}

	async submitForm(): Promise<void> {
		await this.signupButton.click()
	}

	// #endregion

	// #region Validations

	async validateRegistrationSuccess(expectedText: string): Promise<void> {
		await expect(this.successMessage).toHaveText(expectedText)
	}

	// #endregion
}
