import { test } from '@playwright/test'
import Header from '../../pages/QABrains/Header'
import testData from '../../testData/QABrains/TestData'

test.use({
	storageState: 'storageStates/practiceUser.json'
})
// Verify auth from session storage for practice user
test('Check storage state for order user', async ({ page }) => {
	const header = new Header(page)
	await page.goto(`${testData.Endpoint}ecommerce/login`)

	await header.validateUserName(testData.Users.PracticeUser.Username)
})
