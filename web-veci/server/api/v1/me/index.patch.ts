import { currentUser } from '../../../mock/people'
import type { NewProfile, Person } from '../../../../app/api/types'

/** PATCH /me — completa el perfil de una cuenta nueva (nombre y colonia). */
export default defineMockHandler(500, async (event): Promise<Person> => {
  const body = await readBody<Partial<NewProfile> | undefined>(event)
  const fields: Record<string, string> = {}
  if (!body?.name?.trim()) fields.name = 'Falta el nombre'
  if (!body?.colony?.trim()) fields.colony = 'Falta la colonia'
  if (Object.keys(fields).length) validationError(fields)
  return { ...currentUser, name: body!.name!.trim() }
})
