import { setupWorker } from 'msw/browser'
import { handlers } from '~/mocks/handlers'
import { seedDatabase } from '~/mocks/seed'
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  seedDatabase()

  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || '/'

  const worker = setupWorker(...handlers)
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${baseURL}mockServiceWorker.js`,
    },
  })
})
