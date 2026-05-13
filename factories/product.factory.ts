import { faker } from '@faker-js/faker'
import { ProductDto } from '../tests/api/Payload.dto'

export class ProductFactory {
	static create(overrides?: Partial<ProductDto>): Omit<ProductDto, 'taxPercentage'> {
		return {
			title: faker.commerce.product(),
			description: faker.commerce.productDescription(),
			category: faker.commerce.department(),
			price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
			discountPercentage: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
			rating: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
			stock: faker.number.int({ min: 0, max: 100 }),
			...overrides
		}
	}

	static book(): Omit<ProductDto, 'taxPercentage'> {
		return this.create({
			title: faker.book.title(),
			description: faker.book.series(),
			category: faker.book.genre()
		})
	}

	static vehicle(overrides?: Partial<ProductDto>): Omit<ProductDto, 'taxPercentage'> {
		return this.create({
			title: faker.vehicle.vehicle(),
			description: faker.vehicle.model(),
			category: faker.vehicle.type(),
			...overrides
		})
	}
}
