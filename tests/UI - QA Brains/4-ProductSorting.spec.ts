import { test } from '@playwright/test'
import Helpers from '../../pages/QABrains/Helpers'
import ProductListing from '../../pages/QABrains/ProductListing'
import testData from '../../testData/QABrains/TestData'

test('E2E test - place order', async ({ page }) => {
	const helpers = new Helpers(page)
	const productListing = new ProductListing(page)

	// Step 1: Login
	await helpers.loginAs({
		endpoint: `${testData.Endpoint}ecommerce/login`,
		username: testData.Users.OrderUser.Username,
		password: testData.Users.OrderUser.Password
	})

	// Step 2:  Validate if default sorting state is selected
	await productListing.validateSortingState(testData.SortingOptions.Default)
	await productListing.validateFirstOrLastProductName(true, testData.Products.Shirt.Name)
	await productListing.validateFirstOrLastProductName(false, testData.Products.TShirt.Name)

	// Step 3:  Change sorting option - Z to A
	await productListing.pressSortingButton()
	await productListing.pressSortingOptionByName(testData.SortingOptions.ZA)
	await productListing.validateSortingState(testData.SortingOptions.ZA)
	await productListing.validateFirstOrLastProductName(true, testData.Products.TShirt.Name)
	await productListing.validateFirstOrLastProductName(false, testData.Products.Shirt.Name)

	// Step 4:  Change sorting option - A to Z
	await productListing.pressSortingButton()
	await productListing.pressSortingOptionByName(testData.SortingOptions.AZ)
	await productListing.validateSortingState(testData.SortingOptions.AZ)
	await productListing.validateFirstOrLastProductName(true, testData.Products.Shirt.Name)
	await productListing.validateFirstOrLastProductName(false, testData.Products.TShirt.Name)

	// Step 5:  Change sorting option - price asc
	await productListing.pressSortingButton()
	await productListing.pressSortingOptionByName(testData.SortingOptions.PriceAsc)
	await productListing.validateSortingState(testData.SortingOptions.PriceAsc)
	await productListing.validateFirstOrLastProductName(true, testData.Products.TShirtSkull.Name)
	await productListing.validateFirstOrLastProductName(false, testData.Products.Sunglasses.Name)
	await productListing.validateFirstOrLastProductPrice(
		true,
		testData.Products.TShirtSkull.Price,
		testData.CurrencySymbol
	)
	await productListing.validateFirstOrLastProductPrice(
		false,
		testData.Products.Sunglasses.Price,
		testData.CurrencySymbol
	)

	// Step 6:  Change sorting option - price desc
	await productListing.pressSortingButton()
	await productListing.pressSortingOptionByName(testData.SortingOptions.PriceDesc)
	await productListing.validateSortingState(testData.SortingOptions.PriceDesc)
	await productListing.validateFirstOrLastProductName(true, testData.Products.Sunglasses.Name)
	await productListing.validateFirstOrLastProductName(false, testData.Products.TShirtSkull.Name)
	await productListing.validateFirstOrLastProductPrice(
		true,
		testData.Products.Sunglasses.Price,
		testData.CurrencySymbol
	)
	await productListing.validateFirstOrLastProductPrice(
		false,
		testData.Products.TShirtSkull.Price,
		testData.CurrencySymbol
	)
})
