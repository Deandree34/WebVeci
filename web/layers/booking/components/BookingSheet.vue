<script setup lang="ts">
import type { Booking, BookingRequest, Business, Service } from '~/api/types'
import { useCreateBooking } from '../queries'

/**
 * Apartar cita (capacidad `citas`): servicio → día y horario → nombre → confirmación.
 * `initialDay`/`initialTime` preseleccionan el horario elegido en el feed o en el detalle;
 * `initialService`, el servicio elegido en la lista de precios del negocio.
 *
 * Sistema tipográfico de los posts: rótulos de sección en Lora cursiva (la voz con la que la app
 * le habla al vecino), interfaz en la fuente del sistema y los horarios (cifras) en Plus Jakarta Sans.
 * Solo neutros: lo elegido va en blanco.
 */
interface BookingSheetProps {
  business: Business
  initialDay?: BookingRequest['day']
  initialTime?: string
  initialService?: string
}

type Day = BookingRequest['day']

const DAY_LABEL: Record<Day, string> = { today: 'Hoy', tomorrow: 'Mañana' }

const DAYS: Day[] = ['today', 'tomorrow']

/** Rótulo de cada sección del formulario. */
const LABEL_CLASS = 'mb-sm block font-quote text-section leading-[1.3] font-medium text-ink italic'

/** Duración del servicio, para acompañar el precio: "45 min", "2 h". */
function serviceDuration(item: Service) {
  if (!item.durationMinutes) return ''
  return formatDuration(item.durationMinutes)
}

/** Opción elegible (servicio u horario): lo elegido con borde blanco; `solid`, además relleno blanco. */
function optionClass(selected: boolean, solid = false) {
  let state = 'border-hairline-strong text-ink hover:bg-surface-soft'
  if (selected && solid) state = 'border-ink bg-ink text-canvas'
  else if (selected) state = 'border-ink bg-surface-elevated text-ink'
  return ['rounded-control border transition-colors', state]
}

const props = defineProps<BookingSheetProps>()
const open = defineModel<boolean>('open', { default: false })

const now = useNow()
const { mutate: createBooking, isPending, isError, reset: resetMutation } = useCreateBooking()

/** Horarios que aún se pueden apartar, por día (los de hoy que ya pasaron no). */
const slotsByDay = computed(() => {
  const availability = props.business.availability
  if (!availability) return { today: [], tomorrow: [] }
  const free = freeSlots(availability, colonyHour(now.value))
  const today = free.day === 'today' ? free.slots : []
  return { today, tomorrow: availability.tomorrow }
})
const days = computed(() => DAYS.filter((value) => slotsByDay.value[value].length))
const dayOptions = computed(() => days.value.map((value) => ({ value, label: DAY_LABEL[value] })))

const service = ref('')
const day = ref<Day>('today')
const time = ref('')
const customerName = ref('')
const confirmed = ref<Booking>()

/** Al abrir: estado limpio + preselección (solo si el horario sigue libre). */
function reset() {
  confirmed.value = undefined
  resetMutation()
  const services = props.business.services ?? []
  const initial = services.find((item) => item.name === props.initialService)
  service.value = initial?.name ?? services[0]?.name ?? ''
  const presetDay = props.initialDay
  const presetTime = props.initialTime
  if (presetDay && presetTime && slotsByDay.value[presetDay].includes(presetTime)) {
    day.value = presetDay
    time.value = presetTime
    return
  }
  day.value = days.value[0] ?? 'today'
  time.value = ''
}
watch(open, (isOpen) => {
  if (isOpen) reset()
}, { immediate: true })

function selectDay(value: Day) {
  day.value = value
  time.value = ''
}

function close() {
  open.value = false
}

const selectedService = computed(() => props.business.services?.find((item) => item.name === service.value))
const canSubmit = computed(() =>
  !!service.value && !!time.value && customerName.value.trim().length > 1 && !isPending.value
)

/** Resumen sobre el botón, una vez elegido el horario: "Manicure · Mañana 10:30 · $180". */
const summary = computed(() => {
  if (!time.value) return []
  const price = selectedService.value ? formatMoney(selectedService.value.price) : ''
  return [service.value, `${DAY_LABEL[day.value]} ${time.value}`, price].filter(Boolean)
})

const title = computed(() => (confirmed.value ? 'Cita apartada' : 'Apartar cita'))
const subtitle = computed(() => (confirmed.value ? undefined : props.business.name))
const submitText = computed(() => (isPending.value ? 'Apartando…' : 'Apartar cita'))

function submit() {
  if (!canSubmit.value) return
  const request = {
    businessId: props.business.id,
    service: service.value,
    day: day.value,
    time: time.value,
    customerName: customerName.value.trim()
  }
  createBooking(request, {
    onSuccess: (booking) => {
      confirmed.value = booking
    }
  })
}

const dayLabel = DAY_LABEL
const label = LABEL_CLASS
const option = optionClass
</script>

<template>
  <BSheet
    v-model:open="open"
    :title="title"
    :subtitle="subtitle"
    quote
  >
    <!-- Confirmación -->
    <div v-if="confirmed" class="flex flex-col items-center py-sm text-center">
      <BIconCircle icon="material-symbols:check-rounded" size="lg" class="mb-sm" />
      <p class="font-quote text-section leading-[1.35] font-medium text-ink italic">“{{ confirmed.service }} en {{ business.name }}”</p>
      <p class="mt-xxs text-support leading-[1.4] text-body">
        {{ dayLabel[confirmed.day] }} a las {{ confirmed.time }}<BDot />a nombre de {{ confirmed.customerName }}
      </p>
      <!-- Acción principal en ocre (lo que te toca hacer); las selecciones de día y hora siguen en blanco -->
      <div class="mt-lg flex gap-xs">
        <BButton to="/mis-cosas" variant="primary" @click="close">Ver en Mis cosas</BButton>
        <BButton @click="close">Listo</BButton>
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
            :class="[option(service === item.name), 'flex flex-col p-sm text-left']"
            :aria-pressed="service === item.name"
            @click="service = item.name"
          >
            <span class="block truncate text-label leading-[1.3] font-semibold">{{ item.name }}</span>
            <!-- Precio y duración, lo que más se compara: separados del nombre por una línea, precio con la fuente de las horas -->
            <span class="mt-xs flex flex-wrap items-center justify-between gap-x-xs gap-y-0.5 border-t border-hairline pt-xs">
              <span class="flex items-baseline gap-1">
                <span v-if="item.fromPrice" class="text-support font-medium text-muted">Desde</span>
                <span class="font-headline text-label font-semibold text-ink tabular-nums">{{ formatMoney(item.price) }}</span>
              </span>
              <span v-if="serviceDuration(item)" class="flex items-center gap-0.5 text-support font-medium text-body tabular-nums">
                <Icon name="material-symbols:schedule-outline" size="14" class="shrink-0" aria-hidden="true" />
                <span class="sr-only">Duración:</span>
                {{ serviceDuration(item) }}
              </span>
            </span>
          </button>
        </div>
      </fieldset>

      <fieldset v-if="days.length">
        <legend :class="label">Horario</legend>
        <BSegmented :model-value="day" :options="dayOptions" label="Día" class="mb-sm" @update:model-value="selectDay" />
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
          <BDotList :parts="summary" />
        </p>

        <!-- Error en blanco con ícono: el ocre es solo de la marca, no de los avisos -->
        <p v-if="isError" class="flex items-center gap-xs text-support font-medium text-ink" role="alert">
          <Icon name="material-symbols:error-outline" size="18" class="shrink-0" aria-hidden="true" />
          No se pudo apartar la cita. Intenta de nuevo.
        </p>

        <BButton type="submit" variant="primary" size="xl" block :disabled="!canSubmit">
          {{ submitText }}
        </BButton>

        <p class="flex gap-xs text-support leading-[1.4] text-muted">
          <Icon name="material-symbols:payments-outline" size="16" class="mt-px shrink-0" aria-hidden="true" />
          El pago se hace directo en {{ business.name }}. Si no puedes ir, avísales para liberar el lugar a otro vecino.
        </p>
      </div>
    </form>
  </BSheet>
</template>
