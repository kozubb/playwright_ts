import { test as setup, expect } from '@playwright/test'
import LoginPage from '../../pages/QABrains/Login'
import testData from '../../testData/QABrains/TestData'

setup('authenticate as order user', async ({ page }) => {
	const loginPage = new LoginPage(page)

	await page.goto(`${testData.Endpoint}ecommerce/login`)

	await loginPage.fillEmail(testData.Users.OrderUser.Username)
	await loginPage.fillPassword(testData.Users.OrderUser.Password)
	await loginPage.pressLoginButton()

	await expect(page.locator('.user-name')).toBeVisible()

	await page.context().storageState({
		path: 'storageStates/orderUser.json'
	})
})

setup('authenticate as practice user', async ({ page }) => {
	const loginPage = new LoginPage(page)

	await page.goto(`${testData.Endpoint}ecommerce/login`)

	await loginPage.fillEmail(testData.Users.PracticeUser.Username)
	await loginPage.fillPassword(testData.Users.PracticeUser.Password)
	await loginPage.pressLoginButton()

	await expect(page.locator('.user-name')).toBeVisible()

	await page.context().storageState({
		path: 'storageStates/practiceUser.json'
	})
})
