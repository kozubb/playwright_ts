import { test, expect } from '@playwright/test'
import Homepage from '../../pages/QuickPizza/Homepage'
import testData from '../../testData/QuickPizza/TestData'
import { PizzaPayloadDto } from './Payload.dto'
import { faker } from '@faker-js/faker'

// 1. Prepare mock pizza response using faker
const mockedPizzaPayload: PizzaPayloadDto = {
	pizza: {
		id: faker.number.int({ min: 100000, max: 200000 }),
		name: `${faker.food.ethnicCategory()} ${faker.food.dish()}`,
		dough: {
			ID: faker.number.int({ min: 1, max: 20 }),
			name: faker.food.adjective(),
			caloriesPerSlice: faker.number.int({ min: 10, max: 400, multipleOf: 10 })
		},
		ingredients: [
			{
				ID: faker.number.int({ min: 1, max: 20 }),
				name: faker.food.ingredient(),
				caloriesPerSlice: faker.number.int({ min: 1, max: 100 }),
				vegetarian: faker.datatype.boolean()
			},
			{
				ID: faker.number.int({ min: 1, max: 30 }),
				name: faker.food.ingredient(),
				caloriesPerSlice: faker.number.int({ min: 1, max: 50 }),
				vegetarian: faker.datatype.boolean()
			},
			{
				ID: faker.number.int({ min: 1, max: 40 }),
				name: faker.food.ingredient(),
				caloriesPerSlice: faker.number.int({ min: 1, max: 50 }),
				vegetarian: faker.datatype.boolean()
			}
		],
		tool: faker.commerce.product()
	},
	calories: faker.number.int({ min: 200, max: 500 }),
	vegetarian: faker.datatype.boolean()
}
test('Mock pizza response and validate', async ({ page }) => {
	const homepage = new Homepage(page)

	// 2. Mock random pizza API response
	await page.route(`${testData.Endpoint}api/pizza`, async route => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockedPizzaPayload)
		})
	})

	// 3. Prepare to wait for network responses
	const responsePizza = page.waitForResponse(response => response.url().includes('/api/pizza'))

	// 4. Navigate to homepage
	await page.goto(testData.Endpoint)

	// 5. Press the pizza button
	await homepage.pressPizzaButton()

	// 6. Validate pizza API response
	const pizzaResponse = await responsePizza
	expect(pizzaResponse.status()).toBe(200)

	await homepage.validateIfGeneratedPizzaContainsSpecificText(mockedPizzaPayload.pizza.name)
	await homepage.validateIfGeneratedPizzaContainsSpecificText(mockedPizzaPayload.pizza.dough.name)
	await homepage.validateIfGeneratedPizzaContainsSpecificText(mockedPizzaPayload.pizza.ingredients[0].name)
	await homepage.validateIfGeneratedPizzaContainsSpecificText(mockedPizzaPayload.pizza.ingredients[1].name)
	await homepage.validateIfGeneratedPizzaContainsSpecificText(mockedPizzaPayload.pizza.ingredients[2].name)
	await homepage.validateIfGeneratedPizzaContainsSpecificText(mockedPizzaPayload.pizza.tool)
})
