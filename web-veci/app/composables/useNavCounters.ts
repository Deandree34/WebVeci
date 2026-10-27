import { useNotifications } from '~/features/notifications/queries'
import { useMineStore } from '~/features/bookings/stores'
import { useNotificationsStore } from '~/features/notifications/stores'
import { useSavedStore } from '~/features/businesses/stores'

/** Contadores del vecino que muestra la navegación (Mis cosas, Guardados, Notificaciones sin leer). */
export function useNavCounters() {
  const mine = useMineStore()
  const saved = useSavedStore()
  const notificationsRead = useNotificationsStore()
  const { data: notifications } = useNotifications()

  return reactive({
    mine: computed(() => mine.count),
    saved: computed(() => saved.count),
    notifications: computed(() => (notifications.value ?? []).filter((item) => !notificationsRead.isRead(item.id)).length)
  })
}
