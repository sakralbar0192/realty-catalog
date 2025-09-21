import { setupWorker } from 'msw/browser'
import { handlers } from '~/mocks/handlers'
import { seedDatabase } from '~/mocks/seed'

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'development') {
    seedDatabase() // Заполняем базу данных

    const worker = setupWorker(...handlers)
    worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
})
