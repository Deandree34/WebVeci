import { makeMockNotices } from '../../../mock/notice'

/** GET /notices — próximos avisos de la colonia, ordenados por fecha. */
export default defineMockHandler(200, () => makeMockNotices(Date.now()))
