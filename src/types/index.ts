import 'pinia-plugin-persistedstate'

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
