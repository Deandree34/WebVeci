import type { BookingRequest } from '~/api/types'

/**
 * Ventanas que se abren desde las publicaciones sin salir del feed (las pinta `FeedSheets`,
 * una sola vez en el layout):
 *  - "Ver oferta"   → todas las ofertas vigentes del negocio del post.
 *  - "Ver reseñas"  → todas las reseñas del negocio del post.
 *  - "Apartar"      → la ventana de apartar cita del negocio.
 */
export function useFeedSheetState() {
  /** Negocio cuyas ofertas se ven (`null` = cerrada). */
  const offersFor = useState<string | null>('feed-offers-for', () => null)
  /** Negocio cuyas reseñas se ven (`null` = cerrada). */
  const reviewsFor = useState<string | null>('feed-reviews-for', () => null)
  /** Negocio y preselección de la cita (`null` = cerrada). */
  const booking = useState<{ businessId: string, day?: BookingRequest['day'], service?: string } | null>('feed-booking', () => null)

  function openOffers(businessId: string) {
    offersFor.value = businessId
  }

  function openReviews(businessId: string) {
    reviewsFor.value = businessId
  }

  function openBooking(businessId: string, options: { day?: BookingRequest['day'], service?: string } = {}) {
    offersFor.value = null
    booking.value = { businessId, ...options }
  }

  return { offersFor, reviewsFor, booking, openOffers, openReviews, openBooking }
}
