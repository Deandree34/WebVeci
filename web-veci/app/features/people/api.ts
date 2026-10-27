/**
 * Endpoints de la cuenta del vecino.
 *
 * ⚠️ TEMPORAL — datos dummy con latencia simulada.
 * Cuando exista el backend, este archivo pasa a llamar a la API real.
 */

import { currentUser } from './mock'
import type { Person } from '~/api/types'

export { currentUser }

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const peopleApi = {
  /** Cuenta autenticada. */
  async me(): Promise<Person> {
    await wait(80)
    return currentUser
  }
}
