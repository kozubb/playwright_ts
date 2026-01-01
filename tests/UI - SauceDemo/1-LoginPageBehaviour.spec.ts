import { test } from '@playwright/test'
import LoginPage from '../../pages/SauceDemo/Login'
import ProductListing from '../../pages/SauceDemo/ProductListing'
import HamburgerMenu from '../../pages/SauceDemo/HamburgerMenu'
import testData from '../../testData/SauceDemo/TestData'

// E2E test: Successful login and logout
test('Login into account and logout - success', async ({ page }) => {
	// Step 1: Initialize page objects
	const login = new LoginPage(page)
	const productListing = new ProductListing(page)
	const hamburgerMenu = new HamburgerMenu(page)

	// Step 2: Navigate to the login page
	await page.goto(testData.Endpoint)

	// Step 3: Fill in the login form with valid credentials
	await login.fillInput('username', testData.Users.StandardUser.Username)
	await login.fillInput('password', testData.Users.StandardUser.Password)

	// Step 4: Press the login button
	await login.pressLoginButton()

	// Step 5: Verify that inventory page is loaded and cart is visible
	await page.waitForURL(`${testData.Endpoint}/inventory.html`)
	productListing.validateIfCartIsVisible()

	// Step 6: Open hamburger menu and log out
	hamburgerMenu.pressHamburgerMenuIcon()
	hamburgerMenu.pressHamburgerMenuLogoutBtn()

	// Step 7: Verify return to login page
	await page.waitForURL(`${testData.Endpoint}`)
	login.validateIfLoginButtonIsVisible()
})

// E2E test: Login with wrong password
test('login - wrong password', async ({ page }) => {
	// Step 1: Initialize page objects
	const login = new LoginPage(page)

	// Step 2: Navigate to the login page
	await page.goto(testData.Endpoint)

	// Step 3: Fill in the login form with username and incorrect password
	await login.fillInput('username', testData.Users.StandardUser.Username)
	await login.fillInput('password', testData.Users.StandardUser.IncorrectPassword)

	// Step 4: Press the login button
	await login.pressLoginButton()

	// Step 5: Verify error message for wrong credentials
	await login.validateLoginErrorMessage(testData.Messages.WrongDataMessage)
})

// E2E test: Login with locked-out user
test('login - user is locked', async ({ page }) => {
	// Step 1: Initialize page objects
	const login = new LoginPage(page)

	// Step 2: Navigate to the login page
	await page.goto(testData.Endpoint)

	// Step 3: Fill in the login form with locked-out username
	await login.fillInput('username', testData.Users.LockedUser.Username)
	await login.fillInput('password', testData.Users.LockedUser.Password)

	// Step 4: Press the login button
	await login.pressLoginButton()

	// Step 5: Verify error message for locked user
	await login.validateLoginErrorMessage(testData.Messages.LockedUserMessage)
})
