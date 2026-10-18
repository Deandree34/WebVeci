/**
 * Estructura de navegación de la app.
 *
 * Las categorías no viven aquí: vienen del catálogo (`features/categories`).
 * `counter` indica qué contador del vecino muestra el ítem (Mis cosas, Guardados).
 */
export interface SocialNavLink {
  icon: string
  label: string
  to: string
  counter?: 'mine' | 'saved'
}

/** Columna izquierda (tablet y escritorio). */
export const mainNav: SocialNavLink[] = [
  { icon: 'material-symbols:home', label: 'Inicio', to: '/' },
  { icon: 'material-symbols:checklist', label: 'Mis cosas', to: '/mis-cosas', counter: 'mine' },
  { icon: 'material-symbols:bookmark', label: 'Guardados', to: '/guardados', counter: 'saved' }
]

/** Barra inferior (móvil). */
export const bottomNav: SocialNavLink[] = [
  { icon: 'material-symbols:home', label: 'Inicio', to: '/' },
  { icon: 'material-symbols:explore', label: 'Explorar', to: '/explorar' },
  { icon: 'material-symbols:checklist', label: 'Mis cosas', to: '/mis-cosas', counter: 'mine' },
  { icon: 'material-symbols:bookmark', label: 'Guardados', to: '/guardados', counter: 'saved' }
]

/** Ruta de una categoría. */
export const categoryPath = (slug: string) => `/categoria/${slug}`

/** Ruta del detalle de un negocio. */
export const businessPath = (slug: string) => `/negocio/${slug}`
