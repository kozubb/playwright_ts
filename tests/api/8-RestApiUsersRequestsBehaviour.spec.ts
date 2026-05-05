import { test, expect } from 'playwright/test'
import { LoginDto } from './Payload.dto'

// Base API configuration
const restApiUrl: string = 'https://dummyjson.com'
const pathUsers: string = 'users'

// Test data used to find a specific user
const firstName: string = 'Alexander'
const lastName: string = 'Jones'

test.describe.serial('Users API', () => {
	// Variables shared across tests (state)
	let userId: number
	let userName: string
	let userPassword: string
	let accessToken: string

	test('GET all users', async ({ request }) => {
		// Send request to fetch all users
		const responseUsers = await request.get(`${restApiUrl}/${pathUsers}`)

		// Verify response status
		expect(responseUsers.status()).toBe(200)

		// Parse response body
		const responseUsersBody = await responseUsers.json()

		// Find a specific user by first and last name
		const user = responseUsersBody.users.find(
			(u: { firstName: string; lastName: string }) => u.firstName === firstName && u.lastName === lastName
		)

		// Save user ID for use in subsequent tests
		userId = user.id
	})

	test('GET user based on id and save login credentials', async ({ request }) => {
		// Fetch user details using ID from previous test
		const responseUser = await request.get(`${restApiUrl}/${pathUsers}/${userId}`)

		// Validate response status
		expect(responseUser.status()).toBe(200)

		// Parse response body
		const responseUserBody = await responseUser.json()

		// Validate returned user data
		expect(responseUserBody.firstName).toBe(firstName)
		expect(responseUserBody.lastName).toBe(lastName)

		// Save credentials for login test
		userName = responseUserBody.username
		userPassword = responseUserBody.password
	})

	test('POST login user and get tokens', async ({ request }) => {
		// Send login request with user credentials
		const loginUser = await request.post(`${restApiUrl}/${pathUsers}/login`, {
			data: <LoginDto>{
				username: `${userName}`,
				password: `${userPassword}`,
				expiresInMins: 30
			},
			headers: { 'Content-Type': 'application/json' }
		})

		// Validate response status
		expect(loginUser.status()).toBe(200)

		// Parse response body
		const loginUserBody = await loginUser.json()

		// Validate returned login data
		expect(loginUserBody).toBeDefined()
		expect(loginUserBody.id).toBe(userId)
		expect(loginUserBody.username).toBe(userName)
		expect(loginUserBody.firstName).toBe(firstName)
		expect(loginUserBody.lastName).toBe(lastName)

		// Save access token for authenticated requests
		accessToken = loginUserBody.accessToken
	})

	test('GET authenticated user', async ({ request }) => {
		// Send request with Bearer token to get current user
		const authUser = await request.get(`${restApiUrl}/${pathUsers}/me`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		})

		// Validate response status
		expect(authUser.status()).toBe(200)

		// Parse response body
		const authUserBody = await authUser.json()

		// Validate authenticated user data
		expect(authUserBody).toBeDefined()
		expect(authUserBody.id).toBe(userId)
		expect(authUserBody.firstName).toBe(firstName)
		expect(authUserBody.lastName).toBe(lastName)
	})

	test('DELETE user by id', async ({ request }) => {
		// Send request to delete user by ID
		const userDelete = await request.delete(`${restApiUrl}/${pathUsers}/${userId}`)

		// Validate response status
		expect(userDelete.status()).toBe(200)

		const userDeletebody = await userDelete.json()

		// Validate deleted user data
		expect(userDeletebody).toBeDefined()
		expect(userDeletebody.id).toBe(userId)
		expect(userDeletebody.firstName).toBe(firstName)
		expect(userDeletebody.lastName).toBe(lastName)
	})
})
