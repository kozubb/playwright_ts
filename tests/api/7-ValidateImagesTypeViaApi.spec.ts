import { test, expect } from 'playwright/test'

// Test data initialization
const restApiUrl: string = 'https://dummyjson.com'
const pathImage: string = 'image'
const imageDimensions: string = '200x100'
const pngType: string = 'png'
const jpegType: string = 'jpeg'
const invalidImgMessage: string = `Unknown image type 'img', expected one of 'png', 'jpg', 'webp'`

test('GET image png with specific dimensions', async ({ request }) => {
	// Get png image
	const responseImage = await request.get(`${restApiUrl}/${pathImage}/${imageDimensions}`)

	expect(responseImage.status()).toBe(200)
	expect(responseImage.headers()['content-type']).toBe(`${pathImage}/${pngType}`)

	const responseBuffer = await responseImage.body()

	expect(responseBuffer.length).toBeGreaterThan(0)
	const isPng = responseBuffer[0] === 0x89 && responseBuffer[1] === 0x50
	expect(isPng).toBeTruthy()
})

test('GET image jpg with specific dimensions', async ({ request }) => {
	// Get jpg image
	const responseImage = await request.get(`${restApiUrl}/${pathImage}/${imageDimensions}?type=jpg`)

	expect(responseImage.status()).toBe(200)
	expect(responseImage.headers()['content-type']).toBe(`${pathImage}/${jpegType}`)

	const responseBuffer = await responseImage.body()

	expect(responseBuffer.length).toBeGreaterThan(0)
	const isJpeg = responseBuffer[0] === 0xff && responseBuffer[1] === 0xd8 && responseBuffer[2] === 0xff
	expect(isJpeg).toBeTruthy()
})

test('GET image - invalid type - 500 error', async ({ request }) => {
	// Provide invalid img type and get error message
	const responseImage = await request.get(`${restApiUrl}/${pathImage}/${imageDimensions}?type=img`)

	expect(responseImage.status()).toBe(500)
	const responseImageBody = await responseImage.json()

	expect(responseImageBody.message).toBe(invalidImgMessage)
})
