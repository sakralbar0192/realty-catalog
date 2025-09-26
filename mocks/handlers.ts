import { http, HttpResponse } from 'msw'
import { db, type Property } from './models'

export const handlers = [
  // GET /api/properties - получение списка с пагинацией и фильтрами
  http.get('/api/properties', async({ request }) => {
    // Artificial delay to demonstrate filter disabling
    await new Promise(resolve => setTimeout(resolve, 2500))

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 20

    // Filter parameters
    const rooms = url.searchParams.get('rooms') ? Number(url.searchParams.get('rooms')) : null
    const priceMin = url.searchParams.get('price_min') ? Number(url.searchParams.get('price_min')) : null
    const priceMax = url.searchParams.get('price_max') ? Number(url.searchParams.get('price_max')) : null
    const areaMin = url.searchParams.get('area_min') ? Number(url.searchParams.get('area_min')) : null
    const areaMax = url.searchParams.get('area_max') ? Number(url.searchParams.get('area_max')) : null

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

    return HttpResponse.json({
      data: paginatedProperties,
      meta: {
        page,
        limit,
        total: allProperties.length,
        totalPages: Math.ceil(allProperties.length / limit),
      },
    })
  }),

  // GET /api/properties/:id - получение одного объекта
  http.get('/api/properties/:id', ({ params }) => {
    const id = params.id as string
    const property = db.property.findFirst({
      where: { id: { equals: id } },
    })

    if (!property) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ data: property })
  }),

  // GET /api/properties/metadata - получение метаданных для фильтров
  http.get('/api/properties/metadata', async() => {
    // Artificial delay to demonstrate filter initialization
    await new Promise(resolve => setTimeout(resolve, 1000))

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

    return HttpResponse.json({
      availableRooms,
      priceRange,
      areaRange,
    })
  }),

  // POST /api/properties - создание нового объекта
  http.post('/api/properties', async({ request }) => {
    const body = await request.json() as Omit<Property, 'id' | 'createdAt'>

    const newProperty = db.property.create({
      ...body,
      createdAt: new Date().toISOString(),
    })

    return HttpResponse.json({ data: newProperty }, { status: 201 })
  }),
]
