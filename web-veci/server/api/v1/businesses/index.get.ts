import { businesses } from '../../../mock/business'

/** GET /businesses?category= — negocios de la colonia, opcionalmente de una categoría. */
export default defineMockHandler(200, (event) => {
  const { category } = getQuery<{ category?: string }>(event)
  return category ? businesses.filter((business) => business.categoryId === category) : businesses
})
