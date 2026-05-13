import { test, expect } from 'playwright/test'
import { ProductFactory } from '../../factories/product.factory'
import { faker } from '@faker-js/faker'

// Test data initialization
const restApiUrl: string = 'https://dummyjson.com'
const pathProduct: string = 'products'
const product = ProductFactory.create()
const book = ProductFactory.book()
const vehicle = ProductFactory.vehicle({ stock: faker.number.int({ min: 0, max: 20 }) })

test.describe.serial('Add different products using product factory', () => {
	test('POST add new random product', async ({ request }) => {
		const responseAddProduct = await request.post(`${restApiUrl}/${pathProduct}/add`, {
			data: product,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		})
		expect(responseAddProduct.status()).toBe(201)

		const responseAddProductBody = await responseAddProduct.json()
		expect(responseAddProductBody.id).toBeDefined()

		expect(responseAddProductBody.title).toBe(product.title)
		expect(responseAddProductBody.price).toBe(product.price)
		expect(responseAddProductBody.discountPercentage).toBe(product.discountPercentage)
		expect(responseAddProductBody.stock).toBe(product.stock)
		expect(responseAddProductBody.rating).toBe(product.rating)
		expect(responseAddProductBody.description).toBe(product.description)
		expect(responseAddProductBody.category).toBe(product.category)
	})

	test('POST add new random book', async ({ request }) => {
		const responseAddBook = await request.post(`${restApiUrl}/${pathProduct}/add`, {
			data: book,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		})
		expect(responseAddBook.status()).toBe(201)

		const responseAddBookBody = await responseAddBook.json()
		expect(responseAddBookBody.id).toBeDefined()

		expect(responseAddBookBody.title).toBe(book.title)
		expect(responseAddBookBody.price).toBe(book.price)
		expect(responseAddBookBody.discountPercentage).toBe(book.discountPercentage)
		expect(responseAddBookBody.stock).toBe(book.stock)
		expect(responseAddBookBody.rating).toBe(book.rating)
		expect(responseAddBookBody.description).toBe(book.description)
		expect(responseAddBookBody.category).toBe(book.category)
	})

	test('POST add new random vehicle', async ({ request }) => {
		const responseAddVehicle = await request.post(`${restApiUrl}/${pathProduct}/add`, {
			data: vehicle,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		})
		expect(responseAddVehicle.status()).toBe(201)

		const responseAddVehicleBody = await responseAddVehicle.json()
		expect(responseAddVehicleBody.id).toBeDefined()

		expect(responseAddVehicleBody.title).toBe(vehicle.title)
		expect(responseAddVehicleBody.price).toBe(vehicle.price)
		expect(responseAddVehicleBody.discountPercentage).toBe(vehicle.discountPercentage)
		expect(responseAddVehicleBody.stock).toBe(vehicle.stock)
		expect(responseAddVehicleBody.rating).toBe(vehicle.rating)
		expect(responseAddVehicleBody.description).toBe(vehicle.description)
		expect(responseAddVehicleBody.category).toBe(vehicle.category)
	})
})
