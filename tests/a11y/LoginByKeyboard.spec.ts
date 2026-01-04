import { test } from '@playwright/test'
import ProductListing from '../../pages/SauceDemo/ProductListing'
import { A11yPage } from '../../pages/SauceDemo/AccessibilityKeys'
import testData from '../../testData/SauceDemo/TestData'
import LoginPage from '../../pages/SauceDemo/Login'

// E2E Test: Successful login via keyboard and navigating to the inventory page
test('Login as a valid user using keyboard @a11y', async ({ page }) => {
	const loginInput = page.getByRole('textbox', { name: /username/i })
	const passwordInput = page.getByRole('textbox', { name: /password/i })

	// Step 1: Initialize all page objects
	const login = new LoginPage(page)
	const productListing = new ProductListing(page)
	const navigate = new A11yPage(page)

	// Step 2: Perform login with standard user credentials using keyboard navigation
	await page.goto(testData.Endpoint)
	await navigate.navigateToNextElement() // Move focus to the username input using keyboard
	await navigate.assertFocusedElement(loginInput) // Ensure username input is focused
	await login.fillInput('username', testData.Users.StandardUser.Username) // Fill username field via keyboard
	await navigate.navigateToNextElement() // Move to password input using keyboard
	await navigate.assertFocusedElement(passwordInput) // Ensure password input is focused
	await login.fillInput('password', testData.Users.StandardUser.Password) // Fill password field via keyboard
	await navigate.performAction() // Perform login action using keyboard

	// Step 3: Verify that the inventory page is loaded and shopping cart icon is visible
	await page.waitForURL(`${testData.Endpoint}/inventory.html`)
	await productListing.validateIfCartIsVisible()
})

// E2E Test: Attempt login with a locked user via keyboard, followed by successful login
test('Login attempt with locked user, followed by successful login using keyboard', async ({ page }) => {
	const loginInput = page.getByRole('textbox', { name: /username/i })
	const passwordInput = page.getByRole('textbox', { name: /password/i })

	// Step 1: Initialize all page objects
	const login = new LoginPage(page)
	const productListing = new ProductListing(page)
	const navigate = new A11yPage(page)

	// Step 2: Attempt login with locked user credentials using keyboard
	await page.goto(testData.Endpoint)
	await navigate.navigateToNextElement() // Move focus to the username input using keyboard
	await navigate.assertFocusedElement(loginInput) // Ensure username input is focused
	await login.fillInput('username', testData.Users.LockedUser.Username) // Fill username field via keyboard
	await navigate.navigateToNextElement() // Move to password input using keyboard
	await navigate.assertFocusedElement(passwordInput) // Ensure password input is focused
	await login.fillInput('password', testData.Users.StandardUser.Password) // Fill password field via keyboard
	await navigate.performAction() // Perform login action using keyboard

	// Step 3: Verify that the locked user error message is displayed
	await login.validateLoginErrorMessage(testData.Messages.LockedUserMessage) // Validate locked user error message

	// Step 4: Retry login with valid credentials for the standard user via keyboard
	await navigate.navigateToPrevElement() // Move focus back to the username input using keyboard
	await navigate.assertFocusedElement(loginInput) // Ensure username input is focused
	await login.fillInput('username', testData.Users.StandardUser.Username) // Fill username field via keyboard
	await navigate.performAction() // Perform login action using keyboard
	await login.validateIfLoginErrorMessageIsVisible(false) // Validate that error message is not visible again
	await navigate.performAction() // Confirm the action using keyboard

	// Step 5: Verify that the inventory page is loaded and shopping cart icon is visible
	await page.waitForURL(`${testData.Endpoint}/inventory.html`)
	await productListing.validateIfCartIsVisible()
})
