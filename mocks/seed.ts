import { db } from './models'

export const seedDatabase = () => {
  const existingProperties = db.property.getAll()

  if (existingProperties.length > 0) {
    return
  }

  // Создаем 100 тестовых объектов недвижимости
  for (let i = 1; i <= 100; i++) {
    const rooms = Math.floor(Math.random() * 4) + 1 // 1-4 комнаты
    const floor = Math.floor(Math.random() * 20) + 1 // 1-20 этаж
    const totalFloors = Math.max(floor + Math.floor(Math.random() * 10), floor) // Этажность >= этажу

    db.property.create({
      id: `prop-${i}`,
      name: `${rooms}-комнатная кв. ${i}`,
      price: Math.floor(Math.random() * 5000000) + 1000000, // 1M - 6M рублей
      area: Math.round((Math.random() * 150 + 25) * 10) / 10, // 25-175 м² с точностью до 0.1
      floor: floor,
      totalFloors: totalFloors,
      imageUrl: `${process.env.NODE_ENV === 'production' ? '/realty-catalog/' : '/'}img/flat.svg`,
      rooms: rooms,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
}
