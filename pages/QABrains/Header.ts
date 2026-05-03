import { Page, Locator } from '@playwright/test'
export default class Header {
	private page: Page

	// Locators
	userDropdownMenu: Locator
	dropdownMenuItemFavourite: Locator

	constructor(page: Page) {
		this.page = page
		this.userDropdownMenu = this.page.locator('[data-slot="dropdown-menu-trigger"]')
		this.dropdownMenuItemFavourite = this.page.getByRole('menuitem', { name: /favorite/i })
	}

	async pressUserDropdownMenu(): Promise<void> {
		await this.userDropdownMenu.click()
	}

	async pressPositionFavoriteFromMenu(): Promise<void> {
		await this.dropdownMenuItemFavourite.click()
	}
}
