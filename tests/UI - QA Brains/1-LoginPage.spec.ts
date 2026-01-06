import { test, expect } from '@playwright/test'
import LoginPage from '../../pages/QABrains/Login'
import testData from '../../testData/QABrains/TestData'

test('Login into account', async ({ page }) => {
	const loginPage = new LoginPage(page)

	// Wait for network response after logout
	const responsePromise = page.waitForResponse(
		response => response.url().includes('/?_rsc') && response.status() === 200
	)

	// Step 1: Open login page
	await page.goto(testData.Endpoint)

	// Step 2: Fill login form
	await loginPage.fillEmail(testData.Users.SuccessUser.Username)
	await loginPage.fillPassword(testData.Users.SuccessUser.Password)

	// Step 3: Login
	await loginPage.pressLoginButton()

	// Step 4: Wait for successful login request
	await page.waitForRequest(`${testData.Endpoint}?logged=true*`)

	// Step 5: Validate login success
	await loginPage.validateLoginSuccessMessage(testData.Messages.LoginSuccessMessage)
	await loginPage.validateLogoutButtonVisible()

	// Step 6: Logout
	await loginPage.pressLogoutButton()

	// Step 7: Validate logout response
	const response = await responsePromise
	expect(response.status()).toBe(200)

	// Step 8: Validate login button visible again
	await loginPage.validateLoginButtonVisible()
})
