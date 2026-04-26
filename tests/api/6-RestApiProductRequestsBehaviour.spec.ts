import { test, expect } from 'playwright/test'

// Test data initialization
const restApiUrl: string = 'https://dummyjson.com'
const pathAllCategories: string = 'products/categories'
const pathProduct: string = 'products'
const categorySmartphones: string = 'smartphones'
const productName: string = 'iPhone X'
const productPrice: number = 899.99
const notExistedCategory: string = 'fruits'
const notExistedId: number = 12345678
const requestBody = {
	// Data to be sent in the POST request body - add new product
	title: 'LEGO City Loader',
	description: 'LEGO City Yellow Wheel Loader',
	category: 'toys',
	price: 15.99,
	discountPercentage: 12.99,
	rating: 4.92,
	stock: 18
}

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

	test('GET products by category - negative scenario - not existed category - empty array, 0 products', async ({
		request
	}) => {
		// Get products from not existed category
		const responseNotExistedCategory = await request.get(
			`${restApiUrl}/${pathProduct}/category/${notExistedCategory}`
		)

		expect(responseNotExistedCategory.status()).toBe(200)
		const responseNotExistedCategoryBody = await responseNotExistedCategory.json()

		// Validate empty array and 0 returned products
		expect(responseNotExistedCategoryBody.products.length).toBe(0)
		expect(responseNotExistedCategoryBody.total).toBe(0)
	})

	test('GET single product by id - negative scenario - not existed id', async ({ request }) => {
		// Get product by id (not existed)
		const responseNotExistedProducts = await request.get(`${restApiUrl}/${pathProduct}/${notExistedId}`)

		expect(responseNotExistedProducts.status()).toBe(404)

		const responseNotExistedProductsBody = await responseNotExistedProducts.json()

		// Validate response message
		expect(responseNotExistedProductsBody.message).toBe(`Product with id '${notExistedId}' not found`)
	})

	test('POST add new product', async ({ request }) => {
		const responseAddProduct = await request.post(`${restApiUrl}/${pathProduct}/add`, {
			data: requestBody,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		})
		expect(responseAddProduct.status()).toBe(201)

		const responseAddProductBody = await responseAddProduct.json()
		console.log(responseAddProductBody)
		expect(responseAddProductBody.id).toBeDefined()

		expect(responseAddProductBody.title).toBe(requestBody.title)
		expect(responseAddProductBody.price).toBe(requestBody.price)
		expect(responseAddProductBody.discountPercentage).toBe(requestBody.discountPercentage)
		expect(responseAddProductBody.stock).toBe(requestBody.stock)
		expect(responseAddProductBody.rating).toBe(requestBody.rating)
		expect(responseAddProductBody.description).toBe(requestBody.description)
		expect(responseAddProductBody.category).toBe(requestBody.category)
	})
})
