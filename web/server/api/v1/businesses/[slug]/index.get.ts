import { findBusiness } from '../../../../mock/business'

/** GET /businesses/:slug — detalle de un negocio (acepta `slug` o `id`). */
export default defineMockHandler(150, (event) => {
  const slug = getRouterParam(event, 'slug')!
  return findBusiness(slug) ?? apiError(404, 'not_found', `Negocio no encontrado: ${slug}`)
})
