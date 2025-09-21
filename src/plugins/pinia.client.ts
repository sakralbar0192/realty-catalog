import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinia = nuxtApp.$pinia as any
  pinia?.use(createPersistedState())
})
