/**
 * Tipos del dominio (contrato provisional).
 *
 * ⚠️ TEMPORAL — mientras se trabaja con datos dummy.
 * Cuando exista el backend, estos tipos se sustituyen por los generados
 * desde su OpenAPI en `app/api/generated/` (fuente única de verdad).
 *
 * Modelo de negocio: `docs/business-model.md`.
 */

/* ------------------------------------------------------------------------- */
/* Contrato de respuesta (lo cumplen el mock de `server/` y el backend real)  */
/* ------------------------------------------------------------------------- */

/*
 * Éxito (2xx): el recurso tal cual, sin envoltorio (como `response_model` en FastAPI).
 * Las listas paginadas usan `Paginated<T>`.
 *
 * Error (4xx/5xx): siempre `ApiErrorBody`, con el status HTTP real. Ver `docs/architecture.md` §6.
 */

export interface Paginated<T> {
  items: T[]
  nextCursor: string | null
}

/**
 * Códigos de error estables: la UI decide por `code`, nunca por `message`.
 * `network_error` no lo manda el servidor: lo pone el cliente cuando no hubo respuesta.
 */
export type ApiErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'internal_error'
  | 'network_error'
  | 'otp_invalid'
  | 'otp_expired'
  | 'otp_locked'

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode
    /** Texto legible (para logs o como respaldo); la UI muestra sus propios textos según `code`. */
    message: string
    /**
     * Datos extra según el código, p. ej.:
     *  - `validation_error` → `{ fields: { name: 'Falta el nombre' } }`
     *  - `otp_invalid`      → `{ attemptsLeft: 3 }`
     */
    details?: Record<string, unknown>
  }
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
  /** Foto de portada del perfil; sin ella se usa el fondo carbón de VECI. */
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
  /** Oferta destacada: la que el negocio publica en el feed. */
  promo?: Promo
  /** Otras ofertas vigentes del negocio (se ven en "Ver oferta" y en su página, no en el feed). */
  extraPromos?: Promo[]
  /** Reseñas de vecinos tras un servicio real; la primera es la destacada. */
  reviews?: Review[]
}

/* ------------------------------------------------------------------------- */
/* Feed: publicaciones tipadas con acción (sin likes ni comentarios)         */
/* ------------------------------------------------------------------------- */

/** Pestaña del feed donde aparece el item (todos aparecen además en "Para ti"). */
export type FeedTab = 'ofertas' | 'citas'

/** Vistas del inicio: las del feed y Notificaciones (sin `tab` = "Para ti"). */
export type HomeTab = FeedTab | 'notificaciones'

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

/**
 * Foto de una publicación del negocio. Puede llevar su propio texto (`caption`) y su contador de
 * reacciones (`likes`, el apretón de manos, sin contar el del vecino).
 */
export interface PostPhoto {
  id: string
  src: string
  alt: string
  caption?: string
  likes: number
}

/** Publicación normal del negocio (novedades, estrenos): texto y fotos, sin acción principal. */
export interface PostItem extends FeedItemBase {
  type: 'publicacion'
  text: string
  photos: PostPhoto[]
}

export type FeedItem = OfferItem | SlotsItem | ReviewItem | PostItem

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

/** Qué avisa una notificación (define el ícono pequeño sobre el avatar). */
export type NotificationKind = 'publicacion' | 'oferta' | 'cita' | 'recomendacion' | 'aviso'

/** Notificación del vecino: algo nuevo de sus negocios o de la colonia. */
export interface AppNotification {
  id: string
  kind: NotificationKind
  /** Negocio del que habla; sin él la publica VECI (avisos de la colonia). */
  businessId?: string
  /** Quién (en negrita) y qué pasó, p. ej. "Barbería El Güero" + "publicó una novedad: …". */
  actor: string
  text: string
  /** A dónde lleva al tocarla. */
  to: string
  createdAt: string
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

/* ---------- Acceso (auth) ---------- */

/** Por dónde llega el código de acceso: WhatsApp primero; SMS como respaldo. */
export type OtpChannel = 'whatsapp' | 'sms'

/** Código enviado: a qué canal y cuándo se puede pedir otro (segundos). */
export interface OtpSent {
  channel: OtpChannel
  resendIn: number
}

/**
 * Código correcto. Entrar y crear cuenta son el mismo flujo: con un número nuevo, `isNew` pide
 * completar el perfil (nombre y colonia). La sesión la guarda el BFF en una cookie httpOnly; el
 * navegador nunca ve el token.
 *
 * Un código mal responde con error: `otp_invalid` (400, `details.attemptsLeft`), `otp_expired` (400)
 * u `otp_locked` (429).
 */
export interface OtpVerification {
  isNew: boolean
  user?: Person
}

/** Perfil mínimo de una cuenta nueva. */
export interface NewProfile {
  name: string
  colony: string
}
