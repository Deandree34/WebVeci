import { makeMockNotifications } from '../../../mock/notification'

/** GET /me/notifications — notificaciones del vecino, de la más reciente a la más antigua. */
export default defineMockHandler(200, () => makeMockNotifications(Date.now()))
