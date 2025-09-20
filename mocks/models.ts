import { factory, primaryKey } from '@mswjs/data'

export interface Property {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  description: string
  createdAt: string
}

export const db = factory({
  property: {
    id: primaryKey(String),
    title: String,
    price: Number,
    location: String,
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    images: Array,
    description: String,
    createdAt: String
  }
})
