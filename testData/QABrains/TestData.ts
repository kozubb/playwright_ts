export interface SuccessUser {
	Username: string
	Password: string
	IncorrectPassword: string
}

export interface OrderUser {
	Username: string
	Password: string
	FirstName: string
	LastName: string
	Zipcode: number
}

export interface Product {
	Name: string
	Id: number
	Price: number
}

export interface TestData {
	Endpoint: string
	CurrencySymbol: string
	DeliveryPrice: number

	Users: {
		SuccessUser: SuccessUser
		OrderUser: OrderUser
	}

	Products: {
		Shoe: Product
	}

	Messages: {
		LoginSuccessMessage: string
		RegisterSuccessfulMessage: string
		ThankYouMessage: string
	}

	RegisterForm: {
		Name: string
		Country: string
		AccountType: string
		Email: string
		Password: string
	}
}

const testData: TestData = {
	Endpoint: 'https://practice.qabrains.com/',
	CurrencySymbol: '$',
	DeliveryPrice: 4.45,

	Users: {
		SuccessUser: {
			Username: 'qa_testers@qabrains.com',
			Password: 'Password123',
			IncorrectPassword: 'TestPassword'
		},
		OrderUser: {
			Username: 'test@qabrains.com',
			Password: 'Password123',
			FirstName: 'TestName',
			LastName: 'TestLastName',
			Zipcode: 1207
		}
	},

	Products: {
		Shoe: {
			Name: 'Sample Shoe Name',
			Id: 2,
			Price: 89.0
		}
	},

	Messages: {
		LoginSuccessMessage: 'Login Successful',
		RegisterSuccessfulMessage: 'Registration Successful',
		ThankYouMessage: 'Thank you for your order!'
	},

	RegisterForm: {
		Name: 'test name',
		Country: 'Poland',
		AccountType: 'Private Job',
		Email: 'test@test.com',
		Password: 'Test123!'
	}
}

export default testData
