import { test, expect } from '@playwright/test'
import { RegisterDto } from './registerForm.dto'
import testData from '../../testData/QABrains/TestData'
import RegisterPage from '../../pages/QABrains/Register'

test('Register account', async ({ page }) => {
	const registerPage = new RegisterPage(page)

	// Prepare test data
	const registerData: RegisterDto = {
		name: testData.RegisterForm.Name,
		country: testData.RegisterForm.Country,
		accountType: testData.RegisterForm.AccountType,
		email: testData.RegisterForm.Email,
		password: testData.RegisterForm.Password
	}

	// Wait for successful registration response
	const registerResponse = page.waitForResponse(
		response => response.url().includes('registration?registered=true') && response.status() === 200
	)

	// Step 1: Open registration page
	await registerPage.open(testData.Endpoint)

	// Step 2: Fill registration form
	await registerPage.fillRegisterForm(registerData)

	// Step 3: Submit form
	await registerPage.submitForm()

	// Step 4: Validate backend response
	const response = await registerResponse
	expect(response.status()).toBe(200)

	// Step 5: Validate success message
	await registerPage.validateRegistrationSuccess(testData.Messages.RegisterSuccessfulMessage)
})
