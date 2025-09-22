import { factory, primaryKey } from '@mswjs/data'

export interface Property {
  id: string
  name: string // "X-комнатная кв. Y"
  price: number // Цена в рублях (целые числа)
  area: number // Площадь в м² (с точностью до десятых)
  floor: number // Номер этажа
  totalFloors: number // Этажность здания
  imageUrl: string // URL изображения планировки
  rooms: number // Количество комнат
  createdAt?: string // Опционально для будущих фич
}

export const db = factory({
  property: {
    id: primaryKey(String),
    name: String,
    price: Number,
    area: Number,
    floor: Number,
    totalFloors: Number,
    imageUrl: String,
    rooms: Number,
    createdAt: String,
  },
})
