import { test, expect } from 'playwright/test'

// Test data initialization
const restApiUrl: string = 'https://dummyjson.com'
const pathAllCategories: string = 'products/categories'
const pathProduct: string = 'products'
const categorySmartphones: string = 'smartphones'
const productName: string = 'iPhone X'
const productPrice: number = 899.99

test.describe.serial('Products API', () => {
	let productId: number
	let urlSmartphones: string

	test('GET all categories and save specific category', async ({ request }) => {
		// Get all categories
		const responseCategories = await request.get(`${restApiUrl}/${pathAllCategories}`)

		expect(responseCategories.status()).toBe(200)
		const responseCategoriesBody = await responseCategories.json()

		// Find target category
		const category = responseCategoriesBody.find((c: { slug: string }) => c.slug === categorySmartphones)

		// Save URL for next test
		urlSmartphones = category.url
	})

	test('GET products by category and save specific product', async ({ request }) => {
		// Get products from category
		const responseSmartphonesCategory = await request.get(urlSmartphones)

		expect(responseSmartphonesCategory.status()).toBe(200)
		const responseSmartphonesCategoryBody = await responseSmartphonesCategory.json()

		// Find product
		const productIndex = responseSmartphonesCategoryBody.products.findIndex(
			(product: { title: string }) => product.title === productName
		)

		if (productIndex === -1) {
			throw new Error('Product not found')
		}

		//  Save product id for next test
		productId = responseSmartphonesCategoryBody.products[productIndex].id
	})

	test('GET single product by id and validate data', async ({ request }) => {
		// Get product by id
		const responseProduct = await request.get(`${restApiUrl}/${pathProduct}/${productId}`)

		expect(responseProduct.status()).toBe(200)
		expect(responseProduct.ok).toBeTruthy()

		const responseProductBody = await responseProduct.json()

		// Validate fields
		expect(responseProductBody.id).toBe(productId)
		expect(responseProductBody.title).toBe(productName)
		expect(responseProductBody.description).toBeDefined()
		expect(responseProductBody.category).toBe(categorySmartphones)
		expect(responseProductBody.price).toBe(productPrice)
		expect(responseProductBody.images.length).toBeGreaterThan(2)
	})
})
