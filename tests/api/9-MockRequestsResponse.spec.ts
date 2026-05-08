import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import nock from 'nock'
import { MockedUserDto } from './Payload.dto'

// Base API configuration
const restApiUrl: string = 'https://dummyjson.com'
const pathUsers: string = 'users'

test('GET Mock request status - 500', async ({ request }) => {
	// Mock API endpoint with 500 Internal Server Error response
	nock(restApiUrl).get(`/${pathUsers}`).query(true).reply(500, {
		error: 'Internal Server Error'
	})

	// Send request to mocked endpoint
	const response = await request.get(`${restApiUrl}/${pathUsers}`, {
		headers: {
			Accept: 'application/json'
		}
	})

	// Verify response status
	expect(response.status()).toBe(500)

	// Parse response body
	const body = await response.json()

	// Verify error message
	expect(body.error).toBe('Internal Server Error')
})

test('GET Mock request status - 404', async ({ request }) => {
	// Mock API endpoint with 404 Not Found response
	nock(restApiUrl).get(`/${pathUsers}`).query(true).reply(404, {
		error: 'User not found'
	})

	// Send request to mocked endpoint
	const response = await request.get(`${restApiUrl}/${pathUsers}`, {
		headers: {
			Accept: 'application/json'
		}
	})

	// Verify response status
	expect(response.status()).toBe(404)

	// Parse response body
	const body = await response.json()

	// Verify error message
	expect(body.error).toBe('User not found')
})

test('GET user data mock with faker', async ({ request }) => {
	// Generate fake user data using faker
	const mockedUser: MockedUserDto = {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email(),
		age: faker.number.int({ min: 18, max: 80 }),
		phoneNumber: faker.phone.number()
	}

	// Create mocked API endpoint returning fake user data
	const scope = nock(restApiUrl).get(`/${pathUsers}/22`).reply(200, mockedUser)

	// Send request to mocked endpoint
	const response = await request.get(`${restApiUrl}/${pathUsers}/22`, {
		headers: {
			Accept: 'application/json'
		}
	})

	// Verify response status
	expect(response.status()).toBe(200)

	// Parse response body
	const body = await response.json()

	// Verify entire response matches mocked data
	expect(body).toEqual(mockedUser)

	// Verify individual response properties
	expect(body.firstName).toBeDefined()
	expect(body.lastName).toBeDefined()
	expect(body.email).toContain('@')
	expect(typeof body.age).toBe('number')
	expect(body.phoneNumber).toBeDefined()

	// Verify that mocked endpoint was called
	scope.done()
})
