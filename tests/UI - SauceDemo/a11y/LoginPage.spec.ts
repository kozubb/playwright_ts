import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'
import fs from 'fs'
import path from 'path'
import testData from '../../../testData/SauceDemo/TestData'

/**
 * Accessibility Audit Test Suite
 * This test uses Axe-core to scan the page for WCAG compliance violations.
 * Tagged with @a11y to be separated from functional tests in CI/CD pipelines.
 */
test('Accessibility Audit - SauceDemo @a11y', async ({ page }) => {
	// Navigate to the application URL defined in test data
	await page.goto(testData.Endpoint)

	// Initialize AxeBuilder and perform the accessibility scan
	const results = await new AxeBuilder({ page }).analyze()

	// Define the directory for accessibility reports (root of the project)
	const reportDir = path.resolve(process.cwd(), 'axe-reports')

	// If any accessibility violations are found, generate a detailed HTML report
	if (results.violations.length > 0) {
		// Ensure the report directory exists, create it if it doesn't
		if (!fs.existsSync(reportDir)) {
			fs.mkdirSync(reportDir, { recursive: true })
		}

		// Generate the visual HTML report using axe-html-reporter
		createHtmlReport({
			results,
			options: {
				projectKey: 'SauceDemo',
				outputDir: reportDir,
				reportFileName: 'accessibility-report.html'
			}
		})
	}

	/**
	 * Assertion: The test will fail if there are any accessibility violations.
	 * We pass a custom error message to help identify the issue in test logs.
	 */
	expect(
		results.violations,
		'Found accessibility violations! Please check the HTML report in axe-reports/'
	).toEqual([])
})
