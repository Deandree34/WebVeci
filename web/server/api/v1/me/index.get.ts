import { currentUser } from '../../../mock/people'

/** GET /me — cuenta autenticada. */
export default defineMockHandler(80, () => currentUser)
