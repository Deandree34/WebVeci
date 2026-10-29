import { findBusiness } from '../../../../mock/business'
import { makeMockFeed } from '../../../../mock/feed'

/**
 * GET /businesses/:id/posts — publicaciones del negocio, de la más reciente a la más antigua.
 * Solo lo que escribe el negocio (las reseñas destacadas las publica VECI) y sin el aviso de
 * horarios: en su página la tarjeta "Horarios libres" ya los muestra en vivo.
 */
export default defineMockHandler(300, (event) => {
  const id = getRouterParam(event, 'slug')!
  const business = findBusiness(id) ?? apiError(404, 'not_found', `Negocio no encontrado: ${id}`)
  return makeMockFeed(Date.now())
    .filter((item) => item.business.id === business.id && item.type !== 'resena' && item.type !== 'horarios')
    .sort((a, z) => z.publishedAt.localeCompare(a.publishedAt))
})
