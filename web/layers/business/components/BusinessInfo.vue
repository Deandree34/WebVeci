<script setup lang="ts">
import type { Business, PaymentMethod } from '~/api/types'

/**
 * Información del perfil: franja de tres columnas (Horario · Dirección · Pago), lado a lado
 * desde md y apiladas en celular. Cada una: su título en Lora cursiva, dato, apoyo y
 * su acción o etiquetas. La semana completa se abre en una ventana aparte ("Ver semana"), así
 * el encabezado nunca cambia de tamaño. Fuente del sistema y solo neutros.
 */
interface BusinessInfoProps {
  business: Business
}

const PAYMENT_INFO: Record<PaymentMethod, { label: string, icon: string }> = {
  efectivo: { label: 'Efectivo', icon: 'material-symbols:payments-outline' },
  tarjeta: { label: 'Tarjeta', icon: 'material-symbols:credit-card-outline' },
  transferencia: { label: 'Transferencia', icon: 'material-symbols:account-balance-outline' }
}

/** Lunes primero, como se lee un horario en México. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

/** Clases de las columnas de la franja. */
const CLASSES = {
  column: 'flex flex-col p-sm',
  title: 'mb-xxs font-quote text-lead leading-[1.3] font-medium tracking-normal text-ink normal-case italic',
  main: 'text-label leading-[1.3] font-semibold',
  support: 'mt-0.5 text-support leading-[1.4] text-body'
}

const props = defineProps<BusinessInfoProps>()

const now = useNow()
const status = computed(() => scheduleStatus(props.business, now.value))
const today = computed(() => colonyWeekday(now.value))
const weekOpen = ref(false)

const week = computed(() =>
  WEEK_ORDER.map((weekday) => {
    const hours = hoursForDay(props.business, weekday)
    return { weekday, name: weekdayLong(weekday), text: dayHoursText(hours), closed: !hours.length }
  })
)

const { column, title, main, support } = CLASSES
const paymentInfo = PAYMENT_INFO
</script>

<template>
  <section class="mt-lg text-left" aria-label="Información del negocio">
    <div class="grid grid-cols-1 divide-y divide-hairline rounded-control border border-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
      <!-- Horario: el estado de ahora; la semana, en su ventana -->
      <div :class="column">
        <h3 :class="title">Horario</h3>
        <p :class="[main, status.open ? 'text-ink' : 'text-body']" class="flex items-center gap-xs">
          <span class="size-2 shrink-0 rounded-full" :class="status.open ? 'bg-ink' : 'bg-muted-soft'" aria-hidden="true" />
          {{ status.label }}
        </p>
        <button
          type="button"
          class="mt-xs inline-flex items-center gap-xxs self-start text-support font-semibold text-body-strong hover:underline"
          @click="weekOpen = true"
        >
          Ver semana
          <Icon name="material-symbols:chevron-right" size="18" aria-hidden="true" />
        </button>
      </div>

      <!-- Dirección: el dato arriba, qué tan lejos debajo ("Cómo llegar" ya está en las acciones) -->
      <div :class="column">
        <h3 :class="title">Dirección</h3>
        <p :class="[main, 'text-ink']">{{ business.address }}</p>
        <p :class="support">{{ business.walkMinutes }} min a pie<BDot />{{ formatDistance(business.distanceMeters) }}</p>
      </div>

      <!-- Pago: cada forma como etiqueta neutra con su ícono -->
      <div :class="column">
        <h3 :class="title">Pago</h3>
        <p :class="[main, 'text-ink']">Directo, sin comisiones</p>
        <ul v-if="business.payments?.length" class="mt-xs flex flex-wrap gap-xs">
          <li v-for="method in business.payments" :key="method" class="inline-flex">
            <BChip :icon="paymentInfo[method].icon">{{ paymentInfo[method].label }}</BChip>
          </li>
        </ul>
      </div>
    </div>

    <!-- La semana completa, fuera del encabezado: lunes a domingo, hoy resaltado y descansos en gris -->
    <BSheet v-model:open="weekOpen" title="Horario" :subtitle="business.name" quote>
      <dl class="flex flex-col">
        <div
          v-for="day in week"
          :key="day.weekday"
          class="flex items-center justify-between rounded-sm px-sm py-xs text-label"
          :class="day.weekday === today ? 'bg-surface-soft font-semibold text-ink' : 'text-body'"
        >
          <dt class="flex items-center gap-xs">
            {{ day.name }}
            <BBadge v-if="day.weekday === today">Hoy</BBadge>
          </dt>
          <dd class="tabular-nums" :class="{ 'text-muted-soft': day.closed }">{{ day.text }}</dd>
        </div>
      </dl>
    </BSheet>
  </section>
</template>
