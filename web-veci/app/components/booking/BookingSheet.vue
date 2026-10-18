<script setup lang="ts">
import type { Booking, BookingRequest, Business } from '~/api/types'
import { useCreateBooking } from '~/features/bookings/queries'

/**
 * Apartar cita (capacidad `citas`): servicio → día y horario → nombre → confirmación.
 * `initialDay`/`initialTime` preseleccionan el horario elegido en el feed o en el detalle.
 */
const props = defineProps<{
  business: Business
  initialDay?: BookingRequest['day']
  initialTime?: string
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
  service.value = props.business.services?.[0]?.name ?? ''
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

function submit() {
  if (!canSubmit.value) return
  createBooking(
    { businessId: props.business.id, service: service.value, day: day.value, time: time.value, customerName: customerName.value.trim() },
    { onSuccess: (booking) => (confirmed.value = booking) }
  )
}

const chip = (selected: boolean) => [
  'rounded-control border px-sm py-xs text-body-sm font-medium transition-colors',
  selected ? 'border-primary bg-primary text-on-primary' : 'border-hairline-strong text-on-dark hover:border-primary'
]
</script>

<template>
  <BSheet v-model:open="open" :title="confirmed ? 'Cita apartada' : `Apartar cita · ${business.name}`">
    <!-- Confirmación -->
    <div v-if="confirmed" class="flex flex-col items-center text-center">
      <Icon name="material-symbols:check-circle" size="48" class="mb-sm text-success" aria-hidden="true" />
      <p class="text-body-md font-medium text-on-dark">{{ confirmed.service }} en {{ business.name }}</p>
      <p class="text-body-sm text-muted">
        {{ dayLabel[confirmed.day] }} a las {{ confirmed.time }} · a nombre de {{ confirmed.customerName }}
      </p>
      <p class="mt-md text-body-xs text-muted">Lo encuentras en Mis cosas. (Datos de prueba: no se envía nada.)</p>
      <div class="mt-md flex gap-xs">
        <PostAction to="/mis-cosas" variant="primary" @click="open = false">Ver en Mis cosas</PostAction>
        <button
          type="button"
          class="rounded-control bg-surface-elevated px-md py-xs text-body-sm font-medium text-on-dark hover:bg-hairline-strong"
          @click="open = false"
        >
          Listo
        </button>
      </div>
    </div>

    <!-- Formulario -->
    <form v-else class="flex flex-col gap-md" @submit.prevent="submit">
      <fieldset v-if="business.services?.length">
        <legend class="mb-xs text-body-sm font-medium text-muted">Servicio</legend>
        <div class="flex flex-wrap gap-xs">
          <button
            v-for="item in business.services"
            :key="item.name"
            type="button"
            :class="chip(service === item.name)"
            :aria-pressed="service === item.name"
            @click="service = item.name"
          >
            {{ item.name }} · {{ formatMoney(item.price) }}
          </button>
        </div>
      </fieldset>

      <fieldset v-if="days.length">
        <legend class="mb-xs text-body-sm font-medium text-muted">Horario</legend>
        <div class="mb-sm flex gap-xs" role="group" aria-label="Día">
          <button
            v-for="option in days"
            :key="option"
            type="button"
            class="rounded-pill px-md py-xxs text-body-sm font-medium transition-colors"
            :class="day === option ? 'bg-on-dark text-canvas' : 'bg-surface-elevated text-muted hover:text-on-dark'"
            :aria-pressed="day === option"
            @click="selectDay(option)"
          >
            {{ dayLabel[option] }}
          </button>
        </div>
        <div class="flex flex-wrap gap-xs">
          <button
            v-for="slot in slotsByDay[day]"
            :key="slot"
            type="button"
            :class="[chip(time === slot), 'tabular-nums']"
            :aria-pressed="time === slot"
            @click="time = slot"
          >
            {{ slot }}
          </button>
        </div>
      </fieldset>
      <p v-else class="text-body-sm text-muted">No quedan horarios libres por ahora.</p>

      <label class="flex flex-col gap-xs">
        <span class="text-body-sm font-medium text-muted">Tu nombre</span>
        <input
          v-model="customerName"
          type="text"
          autocomplete="given-name"
          placeholder="¿A nombre de quién?"
          class="h-11 rounded-control border border-hairline-strong bg-surface-soft px-sm text-body-md text-on-dark placeholder:text-muted-soft focus:border-primary focus:outline-none"
        >
      </label>

      <p v-if="isError" class="text-body-sm text-veci-pink">No se pudo apartar la cita. Intenta de nuevo.</p>

      <button
        type="submit"
        class="h-11 rounded-control bg-veci-gradient text-body-md font-medium text-on-primary transition hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
        :disabled="!canSubmit"
      >
        <template v-if="isPending">Apartando…</template>
        <template v-else>
          Apartar cita<template v-if="time"> · {{ dayLabel[day] }} {{ time }}</template><template v-if="selectedService"> · {{ formatMoney(selectedService.price) }}</template>
        </template>
      </button>

      <p class="flex gap-xs text-body-xs text-muted">
        <Icon name="material-symbols:payments-outline" size="16" class="shrink-0" aria-hidden="true" />
        El pago se hace directo en {{ business.name }}. Si no puedes ir, avísales para liberar el lugar a otro vecino.
      </p>
    </form>
  </BSheet>
</template>
