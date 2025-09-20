import { db } from '~/mocks/models'
import { seedDatabase } from '~/mocks/seed'

export default defineEventHandler(async (event) => {
  // Seed the database if not already seeded
  seedDatabase()

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20

  const allProperties = db.property.getAll()
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProperties = allProperties.slice(startIndex, endIndex)

  return {
    data: paginatedProperties,
    meta: {
      page,
      limit,
      total: allProperties.length,
      totalPages: Math.ceil(allProperties.length / limit)
    }
  }
})