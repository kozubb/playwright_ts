import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'
import fs from 'fs'
import path from 'path'
import testData from '../../../testData/SauceDemo/TestData'

/**
 * Accessibility Audit Test Suite
 * This test uses the Axe-core engine to scan the page for WCAG compliance violations.
 * It is tagged with @a11y to allow for isolated execution in CI/CD pipelines.
 */
test('Accessibility Audit - SauceDemo @a11y', async ({ page }) => {
	// Navigate to the target application URL defined in the test data
	await page.goto(testData.Endpoint)

	// Execute the accessibility scan and capture the results
	const results = await new AxeBuilder({ page }).analyze()

	// Define the absolute path for the accessibility reports directory
	const reportDir = path.resolve(process.cwd(), 'axe-reports')

	/**
	 * Report Generation Logic:
	 * A detailed visual HTML report is generated only if accessibility violations are detected.
	 */
	if (results.violations.length > 0) {
		// Log detection to the console for easier debugging in CI environments
		console.log(`[A11y] ${results.violations.length} violations found. Generating HTML report...`)

		// Create the report directory if it does not already exist
		if (!fs.existsSync(reportDir)) {
			fs.mkdirSync(reportDir, { recursive: true })
		}

		// Generate the visual HTML report using the axe-html-reporter library
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
	 * Final Assertion:
	 * The test will fail if any violations are found.
	 * The custom error message points the user to the generated HTML report.
	 */
	expect(
		results.violations,
		'Found accessibility violations! Please check the HTML report in the axe-reports/ folder.'
	).toEqual([])
})
