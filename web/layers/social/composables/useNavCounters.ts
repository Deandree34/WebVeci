import { useNotifications } from '#layers/notification/queries'
import { useMineStore } from '#layers/booking/stores'
import { useNotificationsStore } from '#layers/notification/stores'
import { useSavedStore } from '#layers/business/stores'

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
