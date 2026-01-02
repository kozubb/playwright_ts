import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'
import fs from 'fs'
import testData from '../../../testData/SauceDemo/TestData'

test('Accessibility Audit - SauceDemo @a11y', async ({ page }) => {
	await page.goto(testData.Endpoint)
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
				reportFileName: 'accessibility-report.html'
			}
		})

		console.log(`[A11y] Scan finished. Check the ${reportDir} folder for the report.`)
	}

	expect(results.violations, 'Accessibility issues found!').toEqual([])
})
