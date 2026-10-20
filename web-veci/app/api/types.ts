/**
 * Tipos del dominio (contrato provisional).
 *
 * ⚠️ TEMPORAL — mientras se trabaja con datos dummy.
 * Cuando exista el backend, estos tipos se sustituyen por los generados
 * desde su OpenAPI en `app/api/generated/` (fuente única de verdad).
 *
 * Modelo de negocio: `docs/business-model.md`.
 */

export interface Paginated<T> {
  items: T[]
  nextCursor: string | null
}

/* ------------------------------------------------------------------------- */
/* Taxonomía: categoría (giro) + capacidades (qué se puede hacer)            */
/* ------------------------------------------------------------------------- */

export type Capability = 'citas' | 'pedidos' | 'cotizacion' | 'solicitud' | 'informativo'

export interface Category {
  id: string
  slug: string
  label: string
  /** Icono Material Symbols, p. ej. `material-symbols:content-cut`. */
  icon: string
  subcategories: string[]
  /** Capacidades por defecto de los negocios de la categoría. */
  capabilities: Capability[]
  /** Ya habilitada en el producto (el resto se muestra como "Próximamente"). */
  available: boolean
}

/* ------------------------------------------------------------------------- */
/* Negocio                                                                   */
/* ------------------------------------------------------------------------- */

/** Rango de horario `[abre, cierra]` en horas; `> 24` = madrugada del día siguiente. */
export type HourRange = [open: number, close: number]

export interface Service {
  name: string
  /** Precio en MXN. */
  price: number
  /** El precio es el mínimo ("Desde $450"): varía según el trabajo. */
  fromPrice?: boolean
  /** Duración aproximada en minutos. */
  durationMinutes?: number
  /** Aclaración corta, p. ej. "Incluye lavado". */
  note?: string
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia'

/** Contacto del negocio (el del vecino nunca se expone). */
export interface BusinessContact {
  /** Número a 10 dígitos para WhatsApp. */
  whatsapp?: string
  phone?: string
}

/** Horarios libres (`"HH:MM"`) para hoy y mañana (capacidad `citas`). */
export interface Availability {
  today: string[]
  tomorrow: string[]
}

export interface Promo {
  text: string
  note: string
  /** Texto de disponibilidad, p. ej. "Quedan 4 lugares". */
  remaining: string
  /** Vigencia: hasta hoy (a `endsAtHour`) o hasta el fin de semana. */
  until: 'today' | 'week'
  endsAtHour?: number
}

export interface Review {
  text: string
  author: string
  street: string
  /** Calificación que dio el vecino tras el servicio (1–5). */
  rating: number
}

/** Vecino que recomienda un negocio: solo nombre de pila y calle (privacidad). */
export interface Recommender {
  name: string
  street: string
}

/** Lo mínimo para mostrar un negocio (cabeceras, historias, listas). */
export interface BusinessSummary {
  id: string
  slug: string
  name: string
  categoryId: string
  subcategory: string
  icon: string
  /** Logo del negocio; sin él se usa el ícono del giro. */
  logoUrl?: string
  verified: boolean
}

export interface Business extends BusinessSummary {
  capabilities: Capability[]
  /** Foto de portada del perfil; sin ella se usa el degradado de VECI. */
  coverUrl?: string
  /** Calificación de 0 a 5. */
  rating: number
  /** Vecinos que lo recomiendan. */
  recommendations: number
  /** Algunos vecinos que lo recomiendan (prueba social en el feed). */
  recommendedBy?: Recommender[]
  distanceMeters: number
  walkMinutes: number
  address: string
  description: string
  /** Horario general (el que usan el feed y las listas). */
  hours: HourRange[]
  /** Horario por día de la semana (0 = domingo); `[]` = cerrado. Sin él, `hours` aplica todos los días. */
  weekHours?: HourRange[][]
  payments?: PaymentMethod[]
  contact?: BusinessContact
  services?: Service[]
  availability?: Availability
  promo?: Promo
  /** Reseñas de vecinos tras un servicio real; la primera es la destacada. */
  reviews?: Review[]
}

/* ------------------------------------------------------------------------- */
/* Feed: publicaciones tipadas con acción (sin likes ni comentarios)         */
/* ------------------------------------------------------------------------- */

/** Pestaña del feed donde aparece el item (todos aparecen además en "Para ti"). */
export type FeedTab = 'ofertas' | 'citas'

interface FeedItemBase {
  id: string
  publishedAt: string
  tab?: FeedTab
  business: Business
}

/** Oferta del negocio (`business.promo`) con cuenta regresiva. */
export interface OfferItem extends FeedItemBase {
  type: 'oferta'
}

/** Aviso de citas disponibles (franja y nivel calculados al momento desde `business.availability`). */
export interface SlotsItem extends FeedItemBase {
  type: 'horarios'
}

/** Reseñas destacadas del negocio (`business.reviews`), las publica VECI. */
export interface ReviewItem extends FeedItemBase {
  type: 'resena'
}

export type FeedItem = OfferItem | SlotsItem | ReviewItem
export type FeedItemType = FeedItem['type']

/* ------------------------------------------------------------------------- */
/* Historias y citas                                                         */
/* ------------------------------------------------------------------------- */

/** Historia de 24 h de un negocio. */
export interface Story {
  id: string
  business: BusinessSummary
  /** Etiqueta corta, p. ej. "Oferta de hoy", "Horarios libres". */
  kind: string
  headline: string
  text: string
  action: { label: string, target: 'business' | 'booking' }
  /** Promoción del negocio: si viene, el visor muestra su cuenta regresiva. */
  promo?: Promo
  seen: boolean
}

export interface BookingRequest {
  businessId: string
  service: string
  day: 'today' | 'tomorrow'
  time: string
  customerName: string
}

export interface Booking extends BookingRequest {
  id: string
  createdAt: string
}

/* ------------------------------------------------------------------------- */
/* Cuenta                                                                    */
/* ------------------------------------------------------------------------- */

/** Cuenta del vecino. */
export interface Person {
  id: string
  handle: string
  name: string
  avatarUrl?: string
}

/** Aviso de la colonia (corte de agua, tianguis, feria…). */
export interface Notice {
  id: string
  title: string
  /** Hora · lugar (o lugar · nota), p. ej. "9 am – 2 pm · De Hidalgo a Juárez". */
  detail: string
  /** Fecha en la zona de la colonia, "YYYY-MM-DD". */
  date: string
  icon: string
}
