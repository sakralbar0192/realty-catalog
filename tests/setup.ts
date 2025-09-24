import { beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '~/mocks/handlers'

// Global type declarations for test environment
declare global {
  // eslint-disable-next-line no-unused-vars
  var $t: (key: string) => string
}

// Import CSS for tests
import '~/assets/styles/main.scss'

// Apply CSS variables to document for testing
const applyCSSVariables = () => {
  const style = document.createElement('style')
  style.textContent = `
    :root {
      --font-family: 'Paratype', system-ui, -apple-system, sans-serif;
      --font-size-xs: 0.75rem;
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --line-height-normal: 1.5;
      --letter-spacing-normal: 0;
    }

    body {
      font-family: 'Paratype', system-ui, -apple-system, sans-serif;
    }
  `
  document.head.appendChild(style)

  // Add font preload links
  const fontLinks = [
    '/fonts/paratype-regular.woff2',
    '/fonts/paratype-medium.woff2',
    '/fonts/paratype-bold.woff2',
  ]

  fontLinks.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.setAttribute('as', 'font')
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Mock server for API calls
const server = setupServer(...handlers)

// Setup before tests
beforeAll(async() => {
  server.listen({ onUnhandledRequest: 'error' })
  applyCSSVariables()
  await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for styles to apply
})

// Reset after each test
afterEach(() => {
  server.resetHandlers()
})

// Cleanup after all tests
afterAll(() => {
  server.close()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver implements globalThis.IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor() {}

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

// Mock window dimensions for desktop view
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1200, // Desktop width
})
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 800,
})

// Global mocks for Vue components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).$t = (key: string) => {
  const translations: Record<string, string> = {
    'properties.table.headers.image': 'Photo',
    'properties.table.headers.name': 'Name',
    'properties.table.headers.area': 'Area',
    'properties.table.headers.floor': 'Floor',
    'properties.table.headers.price': 'Price',
    'properties.loadMore': 'Load More',
    'properties.loading': 'Loading...',
    'properties.empty': 'No properties found',
    'properties.table.imageAlt': 'Floor plan photo of {name}',
  }
  return translations[key] || key
}
