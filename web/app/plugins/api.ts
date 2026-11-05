import { initApiClient } from '~/api/client'

/** Configura el cliente HTTP con la URL base del entorno (mock de `server/` o FastAPI). */
export default defineNuxtPlugin(() => {
  initApiClient(useRuntimeConfig().public.apiBaseUrl as string)
})
