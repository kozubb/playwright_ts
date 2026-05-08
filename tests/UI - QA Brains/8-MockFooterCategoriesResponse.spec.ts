import { test } from '@playwright/test'
import Helpers from '../../pages/QABrains/Helpers'
import Footer from '../../pages/QABrains/Footer'
import testData from '../../testData/QABrains/TestData'
import { FooterCategoryDto } from './Payload.dto'

// Mocked categories API payload
const mockedCategoriesPayload: FooterCategoryDto = {
	status: true,
	message: 'Category',
	data: [testData.FooterCategories.TestCategory, testData.FooterCategories.MockCategory]
}

test('Validate mocked footer categories', async ({ page }) => {
	const helpers = new Helpers(page)
	const footer = new Footer(page)

	// Mock categories API response
	await page.route('https://admin.qabrains.com/api/v1/categories', async route => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockedCategoriesPayload)
		})
	})

	// Login to application
	await helpers.loginAs({
		endpoint: `${testData.Endpoint}ecommerce/login`,
		username: testData.Users.OrderUser.Username,
		password: testData.Users.OrderUser.Password
	})

	// Validate mocked categories in footer after mocking response
	await footer.validateFooterLinkText(testData.FooterCategories.TestCategory.name)
	await footer.validateFooterLinkText(testData.FooterCategories.MockCategory.name)
})
