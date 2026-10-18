/**
 * "Ahora" compartido entre servidor y cliente (milisegundos epoch).
 *
 * El valor se fija en SSR y viaja en el payload (`useState`), de modo que el cliente
 * hidrata con exactamente la misma hora que usó el servidor (sin desajustes en
 * "abierto/cerrado", saludos o cuentas regresivas). Ya montado, avanza en el cliente
 * con un único temporizador por intervalo, compartido por todos los componentes.
 *
 * Usar con las utilidades de `utils/hours.ts`: `colonyHour(now.value)`.
 */

const timers = new Map<number, { subscribers: number, id: ReturnType<typeof setInterval> }>()

export function useNow(intervalMs = 60_000) {
  const now = useState<number>('veci-now', () => Date.now())

  if (import.meta.client) {
    onMounted(() => {
      now.value = Date.now()
      const timer = timers.get(intervalMs)
      if (timer) timer.subscribers += 1
      else timers.set(intervalMs, { subscribers: 1, id: setInterval(() => (now.value = Date.now()), intervalMs) })
    })

    onBeforeUnmount(() => {
      const timer = timers.get(intervalMs)
      if (!timer) return
      timer.subscribers -= 1
      if (timer.subscribers === 0) {
        clearInterval(timer.id)
        timers.delete(intervalMs)
      }
    })
  }

  return now
}
