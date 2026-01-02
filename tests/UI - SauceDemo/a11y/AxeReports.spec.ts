import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'

test('accessibility report generation @a11y', async ({ page }) => {
	const results = await new AxeBuilder({ page }).analyze()

	// Tworzy folder 'axe-reports' i zapisuje tam plik HTML
	createHtmlReport({
		results,
		options: {
			projectKey: 'Moja_Aplikacja',
			outputDir: 'axe-reports',
			reportFileName: 'accessibility-report.html'
		}
	})

	expect(results.violations).toEqual([])
})
