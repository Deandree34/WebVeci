/**
 * Estructura de navegación de la app.
 *
 * Las categorías no viven aquí: vienen del catálogo (`features/categories`).
 * `counter` indica qué contador del vecino muestra el ítem (Mis cosas, Guardados).
 * `icon` es el contorno (inactivo) y `activeIcon` el relleno (sección actual), como X o Instagram.
 */
export interface SocialNavLink {
  icon: string
  activeIcon: string
  label: string
  to: string
  counter?: 'mine' | 'saved'
}

/** Navegación principal: la misma en la columna izquierda (tablet y escritorio) y en la barra inferior (móvil). */
export const mainNav: SocialNavLink[] = [
  { icon: 'material-symbols:home-outline', activeIcon: 'material-symbols:home', label: 'Inicio', to: '/' },
  { icon: 'material-symbols:explore-outline', activeIcon: 'material-symbols:explore', label: 'Explorar', to: '/explorar' },
  { icon: 'material-symbols:assignment-outline', activeIcon: 'material-symbols:assignment', label: 'Mis cosas', to: '/mis-cosas', counter: 'mine' },
  { icon: 'material-symbols:bookmark-outline', activeIcon: 'material-symbols:bookmark', label: 'Guardados', to: '/guardados', counter: 'saved' }
]

/**
 * Barra inferior (móvil): las vistas del feed, para no tener otra barra de pestañas arriba.
 * Explorar va en la lupa de la barra superior y Mis cosas / Guardados en "Tú" (`youNav`).
 */
export const bottomNav: SocialNavLink[] = [
  { icon: 'material-symbols:home-outline', activeIcon: 'material-symbols:home', label: 'Inicio', to: '/' },
  { icon: 'material-symbols:sell-outline', activeIcon: 'material-symbols:sell', label: 'Ofertas', to: '/?tab=ofertas' },
  { icon: 'material-symbols:calendar-month-outline', activeIcon: 'material-symbols:calendar-month', label: 'Citas', to: '/?tab=citas' }
]

const youHints: Record<string, string> = {
  '/mis-cosas': 'Tus citas apartadas',
  '/guardados': 'Negocios que guardaste'
}

/** Panel "Tú" de la barra inferior: lo del vecino (Mis cosas y Guardados), con su descripción. */
export const youNav = mainNav
  .filter((item) => item.to in youHints)
  .map((item) => ({ ...item, hint: youHints[item.to]! }))

/** Ruta de una categoría. */
export const categoryPath = (slug: string) => `/categoria/${slug}`

/** Ruta del detalle de un negocio. */
export const businessPath = (slug: string) => `/negocio/${slug}`
