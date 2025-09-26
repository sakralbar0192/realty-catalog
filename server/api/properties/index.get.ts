import { db } from '~/mocks/models'
import { seedDatabase } from '~/mocks/seed'

export default defineEventHandler(async(event) => {
  // Seed the database if not already seeded
  seedDatabase()

  // Simulate network delay for demonstration
  await new Promise(resolve => setTimeout(resolve, 800))

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20

  // Filter parameters
  const rooms = query.rooms ? Number(query.rooms) : null
  const priceMin = query.price_min ? Number(query.price_min) : null
  const priceMax = query.price_max ? Number(query.price_max) : null
  const areaMin = query.area_min ? Number(query.area_min) : null
  const areaMax = query.area_max ? Number(query.area_max) : null

  let allProperties = db.property.getAll()

  // Apply filters
  if (rooms !== null) {
    allProperties = allProperties.filter(property => property.rooms === rooms)
  }
  if (priceMin !== null) {
    allProperties = allProperties.filter(property => property.price >= priceMin)
  }
  if (priceMax !== null) {
    allProperties = allProperties.filter(property => property.price <= priceMax)
  }
  if (areaMin !== null) {
    allProperties = allProperties.filter(property => property.area >= areaMin)
  }
  if (areaMax !== null) {
    allProperties = allProperties.filter(property => property.area <= areaMax)
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProperties = allProperties.slice(startIndex, endIndex)

  return {
    data: paginatedProperties,
    meta: {
      page,
      limit,
      total: allProperties.length,
      totalPages: Math.ceil(allProperties.length / limit),
    },
  }
})
