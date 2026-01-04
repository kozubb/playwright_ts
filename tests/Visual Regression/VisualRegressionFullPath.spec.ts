import { test, expect } from '@playwright/test'
import LoginPage from '../../pages/SauceDemo/Login'
import Helpers from '../../pages/SauceDemo/Helpers'
import ProductListing from '../../pages/SauceDemo/ProductListing'
import Cart from '../../pages/SauceDemo/Cart'
import Checkout from '../../pages/SauceDemo/Checkout'
import Overview from '../../pages/SauceDemo/Overview'
import ThankYouPage from '../../pages/SauceDemo/ThankYouPage'
import testData from '../../testData/SauceDemo/TestData'

test.describe('Sauce Demo - Visual Regression Suite @visual', () => {
	test('Login page - initial state and filled form @visual', async ({ page }) => {
		const login = new LoginPage(page)

		// Step 1: Navigate to the login page
		await page.goto(testData.Endpoint)

		// Visual verification: Empty login page baseline
		await expect(page).toHaveScreenshot(['snapshots', '01-login-page-default.png'])

		// Step 2: Fill form and check UI state (text presence and focus)
		await login.fillInput('username', testData.Users.StandardUser.Username)
		await login.fillInput('password', testData.Users.StandardUser.Password)
		await expect(page).toHaveScreenshot(['snapshots', '02-login-page-filled.png'])
	})

	test('Login error - validation message look @visual', async ({ page }) => {
		const login = new LoginPage(page)

		// Step 1: Navigate and trigger error
		await page.goto(testData.Endpoint)
		await login.fillInput('username', testData.Users.LockedUser.Username)
		await login.fillInput('password', testData.Users.LockedUser.Password)
		await login.pressLoginButton()

		// Locate the error container element
		const errorContainer = page.locator('.error-message-container')

		// Visual verification: Check only the specific error component UI
		await expect(errorContainer).toHaveScreenshot(['snapshots', '03-login-error-message.png'])
	})

	test('Full order placement flow - Visual Regression @visual', async ({ page }) => {
		// Step 1: Initialize all page objects
		const productListing = new ProductListing(page)
		const cart = new Cart(page)
		const helpers = new Helpers(page)
		const checkout = new Checkout(page)
		const overview = new Overview(page)
		const thankYou = new ThankYouPage(page)

		// Step 2: Log in as standard user
		await helpers.loginAs({
			endpoint: testData.Endpoint,
			username: testData.Users.StandardUser.Username,
			password: testData.Users.StandardUser.Password
		})

		// Step 3: Inventory Page - Initial view with products
		await page.waitForURL(`${testData.Endpoint}/inventory.html`)
		// Full page snapshot to verify the product grid and footer
		await expect.soft(page).toHaveScreenshot(['snapshots', '04-inventory-page.png'], { fullPage: true })

		// Step 4: Add products to cart
		await productListing.pressAddToOrderButton(testData.Products.Backpack.Name)
		await productListing.pressAddToOrderButton(testData.Products.BikeLight.Name)

		// Component snapshot: Verify the shopping cart icon badge with item count
		const cartBadge = page.locator('.shopping_cart_badge')
		await expect.soft(cartBadge).toHaveScreenshot(['snapshots', '05-cart-badge-count.png'])

		// Step 5: Shopping Cart Page
		await productListing.pressShoppingCartIcon()
		await page.waitForURL(`${testData.Endpoint}/cart.html`)
		// Verify cart layout with added products
		await expect.soft(page).toHaveScreenshot(['snapshots', '06-shopping-cart.png'])

		// Step 6: Checkout Information Page
		await cart.pressCheckoutButton()
		await page.waitForURL(`${testData.Endpoint}/checkout-step-one.html`)

		// Visual verification: Empty shipping information form
		await expect.soft(page).toHaveScreenshot(['snapshots', '07-checkout-form-empty.png'])

		// Fill in checkout information
		await checkout.fillCheckoutInput(testData.CheckoutForm.FirstNameText, testData.Users.OrderUser.FirstName)
		await checkout.fillCheckoutInput(testData.CheckoutForm.LastNameText, testData.Users.OrderUser.LastName)
		await checkout.fillCheckoutInput(testData.CheckoutForm.ZipcodeText, testData.Users.OrderUser.Zipcode)

		// Visual verification: Form filled with user data
		await expect.soft(page).toHaveScreenshot(['snapshots', '08-checkout-form-filled.png'])
		await checkout.pressContinueButton()

		// Step 7: Order Overview Page
		await page.waitForURL(`${testData.Endpoint}/checkout-step-two.html`)
		// Verify summary details including prices, taxes and layout
		await expect.soft(page).toHaveScreenshot(['snapshots', '09-order-overview.png'], { fullPage: true })

		// Step 8: Finish and Thank You Page
		await overview.pressFinishButton()
		await page.waitForURL(`${testData.Endpoint}/checkout-complete.html`)

		// Final visual verification of the success page and thank you message
		await expect.soft(page).toHaveScreenshot(['snapshots', '10-thank-you-page.png'])
	})
})
