import { test } from '@playwright/test'
import Helpers from '../../pages/SauceDemo/Helpers'
import ProductListing from '../../pages/SauceDemo/ProductListing'
import Cart from '../../pages/SauceDemo/Cart'
import ProductDetails from '../../pages/SauceDemo/ProductDetails'
import testData from '../../testData/SauceDemo/TestData'

// E2E test: Add products from listing page and verify cart content
test('Add products to cart and verify cart details', async ({ page }) => {
	// Step 1: Initialize page objects
	const productListing = new ProductListing(page)
	const cart = new Cart(page)
	const helpers = new Helpers(page)

	// Step 2: Log in as standard user
	await helpers.loginAs({
		endpoint: testData.Endpoint,
		username: testData.Users.StandardUser.Username,
		password: testData.Users.StandardUser.Password
	})

	// Step 3: Verify inventory page is loaded
	await page.waitForURL(`${testData.Endpoint}/inventory.html`)
	await productListing.validateIfCartIsVisible()

	// Step 4: Add products from listing page
	await productListing.pressAddToOrderButton(testData.Products.Backpack.Name)
	await productListing.validateShoppingCartAmount('1')

	await productListing.pressAddToOrderButton(testData.Products.BikeLight.Name)
	await productListing.validateShoppingCartAmount('2')

	// Step 5: Open cart and validate product details
	await productListing.pressShoppingCartIcon()

	await cart.validateProductTitleInBasket(testData.Products.Backpack.Id, testData.Products.Backpack.Name)
	await cart.validateProductTitleInBasket(testData.Products.BikeLight.Id, testData.Products.BikeLight.Name)

	await cart.validateProductQuantityInCart(0, '1')
	await cart.validateProductQuantityInCart(1, '1')

	await cart.validateProductPriceAndCurrencyInCart(0, testData.CurrencySymbol, testData.Products.Backpack.Price)
	await cart.validateProductPriceAndCurrencyInCart(1, testData.CurrencySymbol, testData.Products.BikeLight.Price)
})

// E2E test: Add products from PDP and verify cart content
test('Add products from PDP to cart and verify cart details', async ({ page }) => {
	// Step 1: Initialize page objects
	const productListing = new ProductListing(page)
	const cart = new Cart(page)
	const productDetails = new ProductDetails(page)
	const helpers = new Helpers(page)

	// Step 2: Log in as standard user
	await helpers.loginAs({
		endpoint: testData.Endpoint,
		username: testData.Users.StandardUser.Username,
		password: testData.Users.StandardUser.Password
	})

	// Step 3: Verify inventory page is loaded
	await page.waitForURL(`${testData.Endpoint}/inventory.html`)
	await productListing.validateIfCartIsVisible()

	// Step 4: Add productBackpack from PDP
	await productListing.pressProductImage(testData.Products.Backpack.Name)
	await page.waitForURL(`${testData.Endpoint}/inventory-item.html?id=${testData.Products.Backpack.Id}`)
	await productDetails.validateProductTitle(testData.Products.Backpack.Name)
	await productDetails.validateProductPrice(testData.Products.Backpack.Price, testData.CurrencySymbol)
	await productDetails.pressAddToCartButton()
	await productListing.validateShoppingCartAmount('1')
	await productDetails.pressBackButton()

	// Step 5: Add productBikeLight from PDP
	await productListing.pressProductImage(testData.Products.BikeLight.Name)
	await page.waitForURL(`${testData.Endpoint}/inventory-item.html?id=${testData.Products.BikeLight.Id}`)
	await productDetails.validateProductTitle(testData.Products.BikeLight.Name)
	await productDetails.validateProductPrice(testData.Products.BikeLight.Price, testData.CurrencySymbol)
	await productDetails.pressAddToCartButton()
	await productListing.validateShoppingCartAmount('2')

	// Step 6: Open cart and validate product details
	await productListing.pressShoppingCartIcon()

	await cart.validateProductTitleInBasket(testData.Products.Backpack.Id, testData.Products.Backpack.Name)
	await cart.validateProductTitleInBasket(testData.Products.BikeLight.Id, testData.Products.BikeLight.Name)

	await cart.validateProductQuantityInCart(0, '1')
	await cart.validateProductQuantityInCart(1, '1')

	await cart.validateProductPriceAndCurrencyInCart(0, testData.CurrencySymbol, testData.Products.Backpack.Price)
	await cart.validateProductPriceAndCurrencyInCart(1, testData.CurrencySymbol, testData.Products.BikeLight.Price)
})

// E2E test: Prevent duplicate adding of same product
test('Add products from PDP and PLP and verify duplicate add is not possible', async ({ page }) => {
	// Step 1: Initialize page objects
	const productListing = new ProductListing(page)
	const productDetails = new ProductDetails(page)
	const helpers = new Helpers(page)

	// Step 2: Log in as standard user
	await helpers.loginAs({
		endpoint: testData.Endpoint,
		username: testData.Users.StandardUser.Username,
		password: testData.Users.StandardUser.Password
	})
	// Step 3: Verify inventory page is loaded
	await page.waitForURL(`${testData.Endpoint}/inventory.html`)
	await productListing.validateIfCartIsVisible()

	// Step 4: Add productBackpack from PDP
	await productListing.pressProductImage(testData.Products.Backpack.Name)
	await page.waitForURL(`${testData.Endpoint}/inventory-item.html?id=${testData.Products.Backpack.Id}`)
	await productDetails.validateProductTitle(testData.Products.Backpack.Name)
	await productDetails.validateProductPrice(testData.Products.Backpack.Price, testData.CurrencySymbol)
	await productDetails.pressAddToCartButton()
	await productListing.validateShoppingCartAmount('1')
	await productDetails.validateIfRemoveButtonIsVisible()
	await productDetails.pressBackButton()

	// Step 5: Verify "Add to Cart" button is disabled for productBackpack
	await productListing.validateIfRemoveButtonIsVisible(testData.Products.Backpack.Name)

	// Step 6: Add productBikeLight from PLP
	await productListing.pressAddToOrderButton(testData.Products.BikeLight.Name)
	await productListing.validateShoppingCartAmount('2')
	await productListing.validateIfRemoveButtonIsVisible(testData.Products.BikeLight.Name)

	// Step 7: Verify "Add to Cart" button is disabled for productBikeLight
	await productListing.validateIfRemoveButtonIsVisible(testData.Products.BikeLight.Name)
})
