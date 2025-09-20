import { http, HttpResponse } from 'msw'
import { db, type Property } from './models'

export const handlers = [
  // GET /api/properties - получение списка с пагинацией
  http.get('/api/properties', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 20
    
    const allProperties = db.property.getAll()
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProperties = allProperties.slice(startIndex, endIndex)
    
    return HttpResponse.json({
      data: paginatedProperties,
      meta: {
        page,
        limit,
        total: allProperties.length,
        totalPages: Math.ceil(allProperties.length / limit)
      }
    })
  }),

  // GET /api/properties/:id - получение одного объекта
  http.get('/api/properties/:id', ({ params }) => {
    const id = params.id as string
    const property = db.property.findFirst({
      where: { id: { equals: id } }
    })
    
    if (!property) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json({ data: property })
  }),

  // POST /api/properties - создание нового объекта
  http.post('/api/properties', async ({ request }) => {
    const body = await request.json() as Omit<Property, 'id' | 'createdAt'>
    
    const newProperty = db.property.create({
      ...body,
      createdAt: new Date().toISOString()
    })
    
    return HttpResponse.json({ data: newProperty }, { status: 201 })
  })
]
