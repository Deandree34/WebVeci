import { categories } from '../../../mock/category'

/** GET /categories — catálogo completo (disponibles y "Próximamente"). */
export default defineMockHandler(80, () => categories)
