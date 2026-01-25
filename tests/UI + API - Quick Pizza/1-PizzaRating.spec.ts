import { test, expect } from '@playwright/test'
import Homepage from '../../pages/QuickPizza/Homepage'
import testData from '../../testData/QuickPizza/TestData'

let userToken: string

// BEFORE ALL TESTS: Obtain CSRF token and login user
test.beforeAll(async ({ request }) => {
	// 1. Request CSRF token from the server
	const csrfResponse = await request.post(`${testData.Endpoint}api/csrf-token`)

	// 2. Extract CSRF token from Set-Cookie header
	const setCookieHeader = csrfResponse.headers()['set-cookie']
	const match = setCookieHeader?.match(/csrf_token=([^;]+)/)
	const csrfToken = match?.[1]

	// 3. Prepare login request body
	const requestBody = {
		username: testData.UserCredentials.Username,
		password: testData.UserCredentials.Password,
		csrf: csrfToken
	}

	// 4. Perform login and retrieve user token
	const loginResponse = await request.post(`${testData.Endpoint}api/users/token/login?set_cookie=true`, {
		data: requestBody,
		headers: {
			'Content-Type': 'application/json',
			'X-Csrf-Token': csrfToken ?? ''
		}
	})

	const loginBody = await loginResponse.json()
	userToken = loginBody.token
})

// TEST: Provide rating for a pizza
test('Provide rating for pizza', async ({ page }) => {
	const homepage = new Homepage(page)

	// 1. Add user token to browser cookies
	await page.context().addCookies([
		{
			name: 'qp_user_token',
			value: userToken,
			domain: new URL(testData.Endpoint).hostname,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'Strict'
		}
	])

	// 2. Prepare to wait for network responses
	const responsePizza = page.waitForResponse(response => response.url().includes('/api/pizza'))

	// 3. Navigate to homepage
	await page.goto(testData.Endpoint)

	// 4. Press the pizza button
	await homepage.pressPizzaButton()

	// 5. Validate pizza API response
	const pizzaResponse = await responsePizza
	expect(pizzaResponse.status()).toBe(200)

	// 6. Press the 'love it' button to rate pizza
	await homepage.pressRecommendButton()
	await homepage.validateIfNoThanksIsVisible()

	// 7. Validate rating API response
	const responseRatings = page.waitForResponse(response => response.url().includes('/api/ratings'))
	const ratingResponse = await responseRatings
	expect(ratingResponse.status()).toBe(201)

	// 8. Validate rating text
	await homepage.validateRatingMessage(testData.RatingMessage)

	// 9. Press 'no thanks' button
	await homepage.pressNoThanksButton()

	// 10. Validate rating API response
	const responseRatings2 = page.waitForResponse(response => response.url().includes('/api/ratings'))
	const ratingResponse2 = await responseRatings2
	expect(ratingResponse2.status()).toBe(201)
})
