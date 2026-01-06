import { test } from '@playwright/test'
import Helpers from '../../pages/QABrains/Helpers'
import ProductListing from '../../pages/QABrains/ProductListing'
import Cart from '../../pages/QABrains/Cart'
import Checkout from '../../pages/QABrains/Checkout'
import Overview from '../../pages/QABrains/Overview'
import ThankYouPage from '../../pages/QABrains/ThankYouPage'
import testData from '../../testData/QABrains/TestData'

test('E2E test - place order', async ({ page }) => {
	const helpers = new Helpers(page)
	const productListing = new ProductListing(page)
	const cart = new Cart(page)
	const checkout = new Checkout(page)
	const overview = new Overview(page)
	const thankYou = new ThankYouPage(page)

	// Step 1: Login
	await helpers.loginAs({
		endpoint: `${testData.Endpoint}ecommerce/login`,
		username: testData.Users.OrderUser.Username,
		password: testData.Users.OrderUser.Password
	})

	// Step 2:  Add product to cart
	await productListing.addProductToCart(testData.Products.Shoe.Name)
	await productListing.openCart()

	// Step 3:  Verify cart
	await cart.validateProductInCart(testData.Products.Shoe.Name)
	await cart.validateProductPriceAndCurrencyInCart(testData.CurrencySymbol, testData.Products.Shoe.Price)
	await cart.checkout()

	// Step 4:  Fill checkout form
	await checkout.fillFirstName(testData.Users.OrderUser.FirstName)
	await checkout.fillLastName(testData.Users.OrderUser.LastName)
	await checkout.validateZipCode(testData.Users.OrderUser.Zipcode)
	await checkout.pressContinueButton()

	// Step 5:  Review and finish order
	await overview.validateTotalPriceAndCurrencyInOverview(
		testData.CurrencySymbol,
		testData.Products.Shoe.Price + testData.DeliveryPrice
	)
	await overview.finishOrder()

	// Step 6:  Verify Thank You page
	await thankYou.validateThankYouMessage(testData.Messages.ThankYouMessage)
})
