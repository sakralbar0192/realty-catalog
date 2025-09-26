import { db } from '~/mocks/models'
import { seedDatabase } from '~/mocks/seed'

export default defineEventHandler(async() => {
  // Seed the database if not already seeded
  seedDatabase()

  const allProperties = db.property.getAll()

  // Calculate available rooms
  const availableRooms = Array.from(new Set(allProperties.map(p => p.rooms))).sort((a, b) => a - b)

  // Calculate price range
  const prices = allProperties.map(p => p.price)
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }

  // Calculate area range
  const areas = allProperties.map(p => p.area)
  const areaRange = {
    min: Math.min(...areas),
    max: Math.max(...areas),
  }

  return {
    availableRooms,
    priceRange,
    areaRange,
  }
})
