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
		Shirt: Product
		TShirt: Product
		TShirtSkull: Product
		Sunglasses: Product
	}

	Messages: {
		LoginSuccessMessage: string
		RegisterSuccessfulMessage: string
		ThankYouMessage: string
		ToastAddedFavourite: string
		ToastRemovedFavourite: string
		NoFavoriteItems: string
	}

	RegisterForm: {
		Name: string
		Country: string
		AccountType: string
		Email: string
		Password: string
	}

	SortingOptions: {
		AZ: string
		ZA: string
		PriceAsc: string
		PriceDesc: string
		Default: string
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
		},
		Shirt: {
			Name: 'Sample Shirt Name',
			Id: 1,
			Price: 49.99
		},
		TShirt: {
			Name: 'Sample T-Shirt Name',
			Id: 9,
			Price: 56.45
		},
		TShirtSkull: {
			Name: 'Sample T-Shirt Name',
			Id: 5,
			Price: 45.0
		},
		Sunglasses: {
			Name: 'Sample Sunglass Name',
			Id: 8,
			Price: 256.45
		}
	},

	Messages: {
		LoginSuccessMessage: 'Login Successful',
		RegisterSuccessfulMessage: 'Registration Successful',
		ThankYouMessage: 'Thank you for your order!',
		ToastAddedFavourite: 'Added to favorites',
		ToastRemovedFavourite: 'Removed from favorites',
		NoFavoriteItems: 'You have no favorite products'
	},

	RegisterForm: {
		Name: 'test name',
		Country: 'Poland',
		AccountType: 'Private Job',
		Email: 'test@test.com',
		Password: 'Test123!'
	},
	SortingOptions: {
		AZ: 'A to Z (Ascending)',
		ZA: 'Z to A (Descending)',
		PriceAsc: 'Low to High (Price)',
		PriceDesc: 'High to Low (Price)',
		Default: 'Select...'
	}
}

export default testData
