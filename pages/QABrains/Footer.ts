import { Page, expect } from '@playwright/test'

export default class Footer {
	private page: Page

	constructor(page: Page) {
		this.page = page
	}

	// #region Validations

	async validateFooterLinkText(name: string): Promise<void> {
		await expect(this.page.getByRole('link', { name: name })).toHaveText(name)
	}

	// #endregion
}
