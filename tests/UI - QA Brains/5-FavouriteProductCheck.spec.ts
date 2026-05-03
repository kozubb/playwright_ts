import { test } from '../../Fixtures/LoginFixtures'
import Header from '../../pages/QABrains/Header'
import ProductListing from '../../pages/QABrains/ProductListing'
import testData from '../../testData/QABrains/TestData'

// Verify adding/removing favourites on PLP - login using fixtures
test('User can add and remove product from favourites via PLP', async ({ loggedInUser }) => {
	const productListing = new ProductListing(loggedInUser)
	const header = new Header(loggedInUser)

	// Add product to favourites and verify toast message
	await productListing.pressFavouriteIconOnProduct(testData.Products.Shoe.Name)
	await productListing.validateToastVisibilityAndText(testData.Messages.ToastAddedFavourite)

	// Navigate to favourites page via header
	await header.pressUserDropdownMenu()
	await header.pressPositionFavoriteFromMenu()

	// Verify product is present in favourites
	await productListing.validateFirstOrLastProductName(true, testData.Products.Shoe.Name)

	// Remove product from favourites
	await productListing.pressFavouriteIconOnProduct(testData.Products.Shoe.Name)

	// Verify empty state message is displayed
	await productListing.validateNoFavoriteItemsText(testData.Messages.NoFavoriteItems)
})
