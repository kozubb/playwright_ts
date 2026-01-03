import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'
import fs from 'fs'
import LoginPage from '../../pages/SauceDemo/Login'
import testData from '../../testData/SauceDemo/TestData'

test('Accessibility Audit - SauceDemo - Product Listing Page @a11y', async ({ page }) => {
	const login = new LoginPage(page)

	await page.goto(testData.Endpoint)
	await login.fillInput('username', testData.Users.StandardUser.Username)
	await login.fillInput('password', testData.Users.StandardUser.Password)
	await login.pressLoginButton()
	await page.waitForURL(`${testData.Endpoint}/inventory.html`)

	const results = await new AxeBuilder({ page }).analyze()

	// We use a simple relative path.
	// Playwright executes tests from the project root by default.
	const reportDir = 'axe-reports'

	if (results.violations.length > 0) {
		// Ensure directory exists
		if (!fs.existsSync(reportDir)) {
			fs.mkdirSync(reportDir, { recursive: true })
		}

		createHtmlReport({
			results,
			options: {
				projectKey: 'SauceDemo',
				outputDir: reportDir,
				reportFileName: 'accessibility-report-plp.html'
			}
		})

		console.log(`[A11y] Scan finished. Check the ${reportDir} folder for the report.`)
	}

	expect(results.violations, 'Accessibility issues found!').toEqual([])
})
