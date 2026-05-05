export interface PostsDto {
	title: string
	body: string
	userId: number
}

export interface ProductDto {
	title: string
	description: string
	category: string
	price: number
	discountPercentage: number
	rating: number
	stock: number
	taxPercentage: number
}

export interface LoginDto {
	username: string
	password: string
	expiresInMins?: number
}
