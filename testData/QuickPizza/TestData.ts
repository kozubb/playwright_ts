export interface TestData {
	Endpoint: string
	UserCredentials: {
		Username: string
		Password: string
	}
	RatingMessage: string
}

const testData: TestData = {
	Endpoint: 'https://quickpizza.grafana.com/',
	UserCredentials: {
		Username: 'default',
		Password: '12345678'
	},
	RatingMessage: 'Rated!'
}

export default testData
