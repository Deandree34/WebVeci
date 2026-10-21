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
  counter?: 'mine' | 'saved' | 'notifications'
}

/**
 * Navegación principal de la columna izquierda (tablet y escritorio) y del menú ⋮ (celular).
 * Sin "Inicio": al inicio se llega con el logo de VECI y la pestaña "Para ti".
 */
export const mainNav: SocialNavLink[] = [
  { icon: 'material-symbols:explore-outline', activeIcon: 'material-symbols:explore', label: 'Explorar', to: '/explorar' },
  { icon: 'material-symbols:assignment-outline', activeIcon: 'material-symbols:assignment', label: 'Mis cosas', to: '/mis-cosas', counter: 'mine' },
  { icon: 'material-symbols:bookmark-outline', activeIcon: 'material-symbols:bookmark', label: 'Guardados', to: '/guardados', counter: 'saved' }
]

/**
 * Barra inferior (móvil): las vistas del feed, para no tener otra barra de pestañas arriba.
 * Explorar, Mis cosas y Guardados van en el menú ⋮ del encabezado (`youNav`).
 */
export const bottomNav: SocialNavLink[] = [
  { icon: 'material-symbols:home-outline', activeIcon: 'material-symbols:home', label: 'Inicio', to: '/' },
  { icon: 'material-symbols:sell-outline', activeIcon: 'material-symbols:sell', label: 'Ofertas', to: '/?tab=ofertas' },
  { icon: 'material-symbols:calendar-month-outline', activeIcon: 'material-symbols:calendar-month', label: 'Citas', to: '/?tab=citas' },
  { icon: 'material-symbols:notifications-outline', activeIcon: 'material-symbols:notifications', label: 'Notificaciones', to: '/?tab=notificaciones', counter: 'notifications' }
]

const youHints: Record<string, string> = {
  '/explorar': 'Los negocios de tu colonia, por giro',
  '/mis-cosas': 'Tus citas apartadas',
  '/guardados': 'Negocios que guardaste'
}

/** Panel del menú ⋮ del encabezado (celular): Explorar y lo del vecino (Mis cosas y Guardados), con su descripción. */
export const youNav = mainNav
  .filter((item) => item.to in youHints)
  .map((item) => ({ ...item, hint: youHints[item.to]! }))

/** Ruta de una categoría. */
export const categoryPath = (slug: string) => `/categoria/${slug}`

/** Ruta del detalle de un negocio. */
export const businessPath = (slug: string) => `/negocio/${slug}`
