import { db } from './models'

export const seedDatabase = () => {
  const existingProperties = db.property.getAll()

  if (existingProperties.length > 0) {
    return
  }

  // Создаем 100 тестовых объектов недвижимости
  for (let i = 1; i <= 100; i++) {
    db.property.create({
      id: `prop-${i}`,
      title: `Beautiful Apartment ${i}`,
      price: Math.floor(Math.random() * 500000) + 100000,
      location: `City ${Math.floor(Math.random() * 10) + 1}`,
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area: Math.floor(Math.random() * 200) + 50,
      images: [
        `https://picsum.photos/400/300?random=${i}`,
        `https://picsum.photos/400/300?random=${i + 100}`
      ],
      description: `This is a beautiful property located in a great area. Perfect for families or young professionals.`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
}
