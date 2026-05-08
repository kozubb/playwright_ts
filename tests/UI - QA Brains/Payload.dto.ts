export interface RegisterDto {
	name: string
	country: string
	accountType: string
	email: string
	password: string
}

export interface CategoryData {
	id: number
	name: string
	slug: string
	is_featured: true
}

export interface FooterCategoryDto {
	status: Boolean
	message: string
	data: CategoryData[]
}
