/**
 * Tipos del dominio — **re-exportados del contrato**.
 *
 * La fuente única es `specs/contract/openapi.yaml`; los tipos se generan con
 * `npm run contract:types` en `app/api/generated/schema.d.ts` (ese archivo no se edita a mano).
 * Aquí solo se re-exportan con los nombres que ya usa la app: **ningún import cambia**.
 *
 * Reglas del contrato: `specs/constitution.md` §2.
 * Modelo de negocio: `docs/business-model.md` (raíz del monorepo).
 *
 * Si un tipo no se puede expresar limpio en OpenAPI, se escribe a mano aquí con una nota que
 * diga por qué (hoy: `Paginated<T>` y `HomeTab`).
 */

import type { components } from './generated/schema'

type Schemas = components['schemas']

/* ------------------------------------------------------------------------- */
/* Contrato de respuesta (lo cumplen el mock de `server/` y el backend real)  */
/* ------------------------------------------------------------------------- */

/*
 * Éxito (2xx): el recurso tal cual, sin envoltorio (como `response_model` en FastAPI).
 * Error (4xx/5xx): siempre `ApiErrorBody`, con el status HTTP real.
 */

/**
 * Códigos de error que **el servidor** puede mandar (el enum del contrato).
 * El servidor nunca emite `network_error`: ese es del cliente.
 */
export type ServerApiErrorCode = Schemas['ApiErrorCode']

/**
 * Códigos de error que ve la UI: los del servidor más `network_error`, que lo pone el cliente
 * cuando no hubo respuesta (`status: 0`). La UI decide por `code`, nunca por `message`.
 */
export type ApiErrorCode = ServerApiErrorCode | 'network_error'

export type ApiErrorBody = Schemas['ApiErrorBody']

/**
 * Página de una colección que puede crecer sin límite.
 *
 * A mano porque OpenAPI no tiene genéricos: en el contrato cada colección paginada tiene su
 * propio schema (`FeedPage`, `NotificationPage`). Este alias es solo azúcar para escribir
 * `Paginated<T>` en el código; la forma es la misma.
 */
export interface Paginated<T> {
  items: T[]
  nextCursor: string | null
}

export type FeedPage = Schemas['FeedPage']
export type NotificationPage = Schemas['NotificationPage']

/* ------------------------------------------------------------------------- */
/* Taxonomía: categoría (giro) + capacidades (qué se puede hacer)            */
/* ------------------------------------------------------------------------- */

export type Capability = Schemas['Capability']
export type Category = Schemas['Category']

/* ------------------------------------------------------------------------- */
/* Negocio                                                                   */
/* ------------------------------------------------------------------------- */

/** Rango de horario `[abre, cierra]` en horas; `> 24` = madrugada del día siguiente. */
export type HourRange = Schemas['HourRange']
export type Service = Schemas['Service']
export type PaymentMethod = Schemas['PaymentMethod']
/** Contacto del negocio (el del vecino nunca se expone). */
export type BusinessContact = Schemas['BusinessContact']
/** Horarios libres (`"HH:MM"`) para hoy y mañana (capacidad `citas`). */
export type Availability = Schemas['Availability']
export type Promo = Schemas['Promo']
export type Review = Schemas['Review']
/** Vecino que recomienda un negocio: solo nombre de pila y calle (privacidad). */
export type Recommender = Schemas['Recommender']
/** Lo mínimo para mostrar un negocio (cabeceras, historias, listas). */
export type BusinessSummary = Schemas['BusinessSummary']
export type Business = Schemas['Business']

/* ------------------------------------------------------------------------- */
/* Feed: publicaciones tipadas con acción (sin likes ni comentarios)         */
/* ------------------------------------------------------------------------- */

/** Pestaña del feed donde aparece el item (todos aparecen además en "Para ti"). */
export type FeedTab = Schemas['FeedTab']

/**
 * Vistas del inicio: las del feed y Notificaciones (sin `tab` = "Para ti").
 * A mano: es una vista del frontend, no un dato del contrato.
 */
export type HomeTab = FeedTab | 'notificaciones'

export type FeedItemBase = Schemas['FeedItemBase']
/** Oferta del negocio (`business.promo`) con cuenta regresiva. */
export type OfferItem = Schemas['OfferItem']
/** Aviso de citas disponibles (franja y nivel calculados al momento desde `business.availability`). */
export type SlotsItem = Schemas['SlotsItem']
/** Reseñas destacadas del negocio (`business.reviews`), las publica VECI. */
export type ReviewItem = Schemas['ReviewItem']
export type PostPhoto = Schemas['PostPhoto']
/** Publicación normal del negocio (novedades, estrenos): texto y fotos, sin acción principal. */
export type PostItem = Schemas['PostItem']
export type FeedItem = Schemas['FeedItem']

/* ------------------------------------------------------------------------- */
/* Historias y citas                                                         */
/* ------------------------------------------------------------------------- */

/** Historia de 24 h de un negocio. */
export type Story = Schemas['Story']
export type BookingRequest = Schemas['BookingRequest']
export type Booking = Schemas['Booking']

/* ------------------------------------------------------------------------- */
/* Cuenta                                                                    */
/* ------------------------------------------------------------------------- */

/** Cuenta del vecino. */
export type Person = Schemas['Person']
/** Qué avisa una notificación (define el ícono pequeño sobre el avatar). */
export type NotificationKind = Schemas['NotificationKind']
/** Notificación del vecino: algo nuevo de sus negocios o de la colonia. */
export type AppNotification = Schemas['AppNotification']
/** Aviso de la colonia (corte de agua, tianguis, feria…). */
export type Notice = Schemas['Notice']

/* ---------- Acceso (auth) ---------- */

/** Por dónde llega el código de acceso: WhatsApp primero; SMS como respaldo. */
export type OtpChannel = Schemas['OtpChannel']
/** Código enviado: a qué canal y cuándo se puede pedir otro (segundos). */
export type OtpSent = Schemas['OtpSent']
export type OtpVerification = Schemas['OtpVerification']
/** Perfil mínimo de una cuenta nueva. */
export type NewProfile = Schemas['NewProfile']
