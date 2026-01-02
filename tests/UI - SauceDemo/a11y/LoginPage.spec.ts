import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'
import fs from 'fs'
import testData from '../../../testData/SauceDemo/TestData'

test('Accessibility Audit - SauceDemo @a11y', async ({ page }) => {
	await page.goto(testData.Endpoint)

	const results = await new AxeBuilder({ page }).analyze()

	const reportDir = 'axe-reports'

	if (results.violations.length > 0) {
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
	}

	expect(results.violations).toEqual([])
})
