<script setup lang="ts">
import type { Booking, BookingRequest, Business, Service } from '~/api/types'
import { useCreateBooking } from '~/features/bookings/queries'

/**
 * Apartar cita (capacidad `citas`): servicio → día y horario → nombre → confirmación.
 * `initialDay`/`initialTime` preseleccionan el horario elegido en el feed o en el detalle;
 * `initialService`, el servicio elegido en la lista de precios del negocio.
 *
 * Sistema tipográfico de los posts: rótulos de sección en Lora cursiva (la voz con la que la app
 * le habla al vecino), interfaz en la fuente del sistema y los horarios (cifras) en Plus Jakarta Sans. Solo neutros: lo elegido va en blanco.
 */
const props = defineProps<{
  business: Business
  initialDay?: BookingRequest['day']
  initialTime?: string
  initialService?: string
}>()

const open = defineModel<boolean>('open', { default: false })

const now = useNow()
const { mutate: createBooking, isPending, isError, reset: resetMutation } = useCreateBooking()

const dayLabel = { today: 'Hoy', tomorrow: 'Mañana' } as const

/** Horarios que aún se pueden apartar, por día (los de hoy que ya pasaron no). */
const slotsByDay = computed(() => {
  const availability = props.business.availability
  if (!availability) return { today: [], tomorrow: [] }
  const free = freeSlots(availability, colonyHour(now.value))
  return { today: free.day === 'today' ? free.slots : [], tomorrow: availability.tomorrow }
})
const days = computed(() => (['today', 'tomorrow'] as const).filter((day) => slotsByDay.value[day].length))

const service = ref('')
const day = ref<BookingRequest['day']>('today')
const time = ref('')
const customerName = ref('')
const confirmed = ref<Booking>()

/** Al abrir: estado limpio + preselección (solo si el horario sigue libre). */
watch(open, (isOpen) => {
  if (!isOpen) return
  confirmed.value = undefined
  resetMutation()
  const services = props.business.services ?? []
  service.value = services.find((item) => item.name === props.initialService)?.name ?? services[0]?.name ?? ''
  const preset = props.initialDay && slotsByDay.value[props.initialDay].includes(props.initialTime ?? '')
  day.value = preset ? props.initialDay! : (days.value[0] ?? 'today')
  time.value = preset ? props.initialTime! : ''
}, { immediate: true })

function selectDay(value: BookingRequest['day']) {
  day.value = value
  time.value = ''
}

const selectedService = computed(() => props.business.services?.find((item) => item.name === service.value))
const canSubmit = computed(() => !!service.value && !!time.value && customerName.value.trim().length > 1 && !isPending.value)

/** Precio y duración del servicio: "$180 · 45 min", "Desde $450 · 2 h". */
function serviceDetail(item: Service) {
  const price = `${item.fromPrice ? 'Desde ' : ''}${formatMoney(item.price)}`
  return item.durationMinutes ? `${price} · ${formatDuration(item.durationMinutes)}` : price
}

/** Resumen sobre el botón, una vez elegido el horario: "Manicure · Mañana 10:30 · $180". */
const summary = computed(() => {
  if (!time.value) return []
  const price = selectedService.value ? formatMoney(selectedService.value.price) : ''
  return [service.value, `${dayLabel[day.value]} ${time.value}`, price].filter(Boolean)
})

function submit() {
  if (!canSubmit.value) return
  createBooking(
    { businessId: props.business.id, service: service.value, day: day.value, time: time.value, customerName: customerName.value.trim() },
    { onSuccess: (booking) => (confirmed.value = booking) }
  )
}

/** Opción elegible (servicio u horario): lo elegido con borde blanco; `solid`, además relleno blanco. */
const option = (selected: boolean, solid = false) => [
  'rounded-control border transition-colors',
  selected
    ? (solid ? 'border-ink bg-ink text-canvas' : 'border-ink bg-surface-elevated text-ink')
    : 'border-hairline-strong text-ink hover:bg-surface-soft'
]
const label = 'mb-sm block font-quote text-section leading-[1.3] font-medium text-ink italic'
const primaryButton = 'flex items-center justify-center rounded-pill bg-ink text-copy font-semibold text-canvas transition-colors hover:bg-body-strong'
</script>

<template>
  <BSheet
    v-model:open="open"
    :title="confirmed ? 'Cita apartada' : 'Apartar cita'"
    :subtitle="confirmed ? undefined : business.name"
    quote
  >
    <!-- Confirmación -->
    <div v-if="confirmed" class="flex flex-col items-center py-sm text-center">
      <span class="mb-sm inline-flex size-12 items-center justify-center rounded-full bg-surface-elevated text-ink" aria-hidden="true">
        <Icon name="material-symbols:check-rounded" size="28" />
      </span>
      <p class="font-quote text-section leading-[1.35] font-medium text-ink italic">“{{ confirmed.service }} en {{ business.name }}”</p>
      <p class="mt-xxs text-support leading-[1.4] text-body">
        {{ dayLabel[confirmed.day] }} a las {{ confirmed.time }}<span class="mx-1 text-muted" aria-hidden="true">·</span>a nombre de {{ confirmed.customerName }}
      </p>
      <div class="mt-lg flex gap-xs">
        <NuxtLink to="/mis-cosas" :class="[primaryButton, 'h-10 px-md']" @click="open = false">Ver en Mis cosas</NuxtLink>
        <button
          type="button"
          class="h-10 rounded-pill border border-hairline-strong px-md text-label font-semibold text-body-strong transition-colors hover:bg-surface-elevated"
          @click="open = false"
        >
          Listo
        </button>
      </div>
      <p class="mt-md text-support text-muted">Lo encuentras en Mis cosas. (Datos de prueba: no se envía nada.)</p>
    </div>

    <!-- Formulario -->
    <form v-else class="flex flex-col gap-lg" @submit.prevent="submit">
      <fieldset v-if="business.services?.length">
        <legend :class="label">Servicio</legend>
        <div class="grid grid-cols-2 gap-xs">
          <button
            v-for="item in business.services"
            :key="item.name"
            type="button"
            :class="[option(service === item.name), 'p-sm text-left']"
            :aria-pressed="service === item.name"
            @click="service = item.name"
          >
            <span class="block truncate text-label leading-[1.3] font-semibold">{{ item.name }}</span>
            <span class="mt-0.5 block truncate text-support leading-[1.4] font-medium text-body">{{ serviceDetail(item) }}</span>
          </button>
        </div>
      </fieldset>

      <fieldset v-if="days.length">
        <legend :class="label">Horario</legend>
        <div class="mb-sm flex gap-xs" role="group" aria-label="Día">
          <button
            v-for="d in days"
            :key="d"
            type="button"
            class="h-9 rounded-pill px-md text-label font-semibold transition-colors"
            :class="day === d ? 'bg-ink text-canvas' : 'bg-surface-elevated text-body hover:text-ink'"
            :aria-pressed="day === d"
            @click="selectDay(d)"
          >
            {{ dayLabel[d] }}
          </button>
        </div>
        <div class="grid grid-cols-4 gap-xs">
          <button
            v-for="slot in slotsByDay[day]"
            :key="slot"
            type="button"
            :class="[option(time === slot, true), 'h-10 font-headline text-label font-semibold tabular-nums']"
            :aria-pressed="time === slot"
            @click="time = slot"
          >
            {{ slot }}
          </button>
        </div>
      </fieldset>
      <p v-else class="text-label text-body">No quedan horarios libres por ahora.</p>

      <label class="block">
        <span :class="label">¿A nombre de quién?</span>
        <input
          v-model="customerName"
          type="text"
          autocomplete="given-name"
          placeholder="Tu nombre"
          class="h-11 w-full rounded-control border border-hairline-strong bg-surface-soft px-sm text-copy text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
        >
      </label>

      <div class="flex flex-col gap-sm border-t border-hairline pt-md">
        <p v-if="summary.length" class="text-support leading-[1.4] font-medium text-body" aria-live="polite">
          <template v-for="(part, i) in summary" :key="part">
            <span v-if="i" class="mx-1 text-muted" aria-hidden="true">·</span>{{ part }}
          </template>
        </p>

        <p v-if="isError" class="text-support font-medium text-veci-pink">No se pudo apartar la cita. Intenta de nuevo.</p>

        <button
          type="submit"
          :class="[primaryButton, 'h-12 w-full disabled:opacity-40 disabled:hover:bg-ink']"
          :disabled="!canSubmit"
        >
          {{ isPending ? 'Apartando…' : 'Apartar cita' }}
        </button>

        <p class="flex gap-xs text-support leading-[1.4] text-muted">
          <Icon name="material-symbols:payments-outline" size="16" class="mt-px shrink-0" aria-hidden="true" />
          El pago se hace directo en {{ business.name }}. Si no puedes ir, avísales para liberar el lugar a otro vecino.
        </p>
      </div>
    </form>
  </BSheet>
</template>
