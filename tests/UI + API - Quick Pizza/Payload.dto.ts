interface Ingredietns {
	ID: number
	name: string
	caloriesPerSlice: number
	vegetarian: boolean
}

export interface PizzaPayloadDto {
	pizza: {
		id: number
		name: string
		dough: {
			ID: number
			name: string
			caloriesPerSlice: number
		}
		ingredients: Ingredietns[]
		tool: string
	}
	calories: number
	vegetarian: boolean
}
