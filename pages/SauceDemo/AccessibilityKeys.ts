import { Locator, Page, expect } from '@playwright/test'

export class A11yPage {
	constructor(private readonly page: Page) {}

	private readonly KEYS = {
		prev: 'Shift+Tab',
		next: 'Tab',
		action: 'Enter'
	}

	// Keyboard navigation

	public async navigateToPrevElement(): Promise<void> {
		await this.page.keyboard.press(this.KEYS.prev)
	}

	public async navigateToNextElement(): Promise<void> {
		await this.page.keyboard.press(this.KEYS.next)
	}

	public async performAction(): Promise<void> {
		await this.page.keyboard.press(this.KEYS.action)
	}

	// Assertions

	public async assertFocusedElement(expectedElement: Locator): Promise<void> {
		await expect(expectedElement).toBeFocused()
	}
}
