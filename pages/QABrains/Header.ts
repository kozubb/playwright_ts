import { Page, Locator, expect } from '@playwright/test'
export default class Header {
	private page: Page

	// Locators
	userDropdownMenu: Locator
	dropdownMenuItemFavourite: Locator
	userName: Locator

	constructor(page: Page) {
		this.page = page
		this.userDropdownMenu = this.page.locator('[data-slot="dropdown-menu-trigger"]')
		this.dropdownMenuItemFavourite = this.page.getByRole('menuitem', { name: /favorite/i })
		this.userName = this.page.locator('.user-name')
	}

	// #region Actions

	async pressUserDropdownMenu(): Promise<void> {
		await this.userDropdownMenu.click()
	}

	async pressPositionFavoriteFromMenu(): Promise<void> {
		await this.dropdownMenuItemFavourite.click()
	}

	// #endregion

	// #region Validations

	async validateUserName(userName: string): Promise<void> {
		await expect(this.userName).toHaveText(userName)
	}

	// #endregion
}
