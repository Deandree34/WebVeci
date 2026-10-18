<script setup lang="ts">
import type { BookingRequest } from '~/api/types'
import { useBusiness } from '~/features/businesses/queries'

definePageMeta({ layout: 'social' })

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.slug))

const { data: business, isError, suspense } = useBusiness(slug)

// En SSR se espera el dato para que el HTML llegue completo y, si no existe, responder 404
if (import.meta.server) {
  await suspense().catch(() => {})
  if (isError.value) setResponseStatus(useRequestEvent()!, 404, 'Negocio no encontrado')
}

useHead({ title: () => `${business.value?.name ?? 'Negocio'} — VECI` })

const now = useNow()
const free = computed(() =>
  business.value?.availability ? freeSlots(business.value.availability, colonyHour(now.value)) : undefined
)
const canBook = computed(() => !!business.value?.capabilities.includes('citas') && !!business.value.availability)

/* ---------- Apartar cita: desde un horario, con `?dia=&hora=` (feed) o `?cita=1` (historias) ---------- */
const sheetOpen = ref(false)
const preset = ref<{ day?: BookingRequest['day'], time?: string }>({})

function openBooking(day?: BookingRequest['day'], time?: string) {
  preset.value = { day, time }
  sheetOpen.value = true
}

// Espera a tener el negocio (al navegar en el cliente aún puede estar cargando) y aplica una sola vez
let presetApplied = false
onMounted(() => {
  watch(canBook, (ready) => {
    if (!ready || presetApplied) return
    presetApplied = true
    const { dia, hora, cita } = route.query
    if ((dia === 'today' || dia === 'tomorrow') && typeof hora === 'string') openBooking(dia, hora)
    else if (cita !== undefined) openBooking(free.value?.day)
  }, { immediate: true })
})

// Al cerrar, se limpia la preselección de la URL para que "atrás" no reabra el panel
watch(sheetOpen, (isOpen) => {
  if (!isOpen && (route.query.dia || route.query.hora || route.query.cita !== undefined)) {
    router.replace({ query: { ...route.query, dia: undefined, hora: undefined, cita: undefined } })
  }
})
</script>

<template>
  <div>
    <template v-if="business">
      <!-- Cabecera -->
      <section class="rounded-card bg-surface-card p-md">
        <div class="flex items-start gap-sm">
          <BusinessAvatar :icon="business.icon" size="lg" />
          <div class="min-w-0 flex-1">
            <h1 class="flex items-center gap-xxs text-title-md font-medium normal-case tracking-normal text-ink">
              <span class="truncate">{{ business.name }}</span>
              <BusinessVerified v-if="business.verified" size="20" />
            </h1>
            <p class="text-body-sm text-muted">{{ business.subcategory }} · {{ business.description }}</p>
            <p class="mt-xxs flex flex-wrap items-center gap-x-xs text-body-xs text-muted">
              <span class="inline-flex items-center gap-xxs">
                <Icon name="material-symbols:star" size="14" class="text-warning" aria-hidden="true" />
                {{ business.rating.toFixed(1) }}
              </span>
              <span aria-hidden="true">·</span>
              <span>{{ business.recommendations }} vecinos lo recomiendan</span>
            </p>
          </div>
          <BusinessSaveButton :business-id="business.id" :business-name="business.name" />
        </div>

        <dl class="mt-md grid grid-cols-[auto_1fr] gap-x-md gap-y-xs text-body-sm">
          <dt class="text-muted">Ahora</dt>
          <dd><BusinessOpenStatus :hours="business.hours" /></dd>
          <dt class="text-muted">Horario</dt>
          <dd class="text-body">{{ hoursText(business.hours) }}</dd>
          <dt class="text-muted">Dónde</dt>
          <dd class="text-body">
            {{ business.address }} · {{ formatDistance(business.distanceMeters) }} ({{ business.walkMinutes }} min caminando)
          </dd>
        </dl>

        <button
          v-if="canBook"
          type="button"
          class="mt-md h-11 w-full rounded-control bg-veci-gradient text-body-md font-medium text-on-primary transition hover:brightness-110"
          @click="openBooking(free?.day, undefined)"
        >
          Apartar cita
        </button>
      </section>

      <!-- Promoción -->
      <section v-if="business.promo" class="mt-md rounded-card bg-surface-card p-md" aria-labelledby="promo-title">
        <p class="mb-xs flex items-center gap-xxs text-body-sm font-medium text-veci-purple-text">
          <Icon name="material-symbols:sell" size="18" aria-hidden="true" /> Oferta
        </p>
        <p id="promo-title" class="text-title-md font-medium tracking-normal text-ink">{{ business.promo.text }}</p>
        <p class="text-body-sm text-muted">{{ business.promo.note }} · {{ business.promo.remaining }}</p>
        <BusinessPromoCountdown :promo="business.promo" class="mt-sm" />
      </section>

      <!-- Horarios libres -->
      <section v-if="canBook && free" class="mt-md rounded-card bg-surface-card p-md">
        <h2 class="mb-sm text-body-md font-medium normal-case text-on-dark">
          Horarios libres · {{ free.day === 'today' ? 'Hoy' : 'Mañana' }}
        </h2>
        <div class="flex flex-wrap gap-xs">
          <button
            v-for="slot in free.slots"
            :key="slot"
            type="button"
            class="rounded-control border border-hairline-strong px-sm py-xs text-body-sm font-medium tabular-nums text-on-dark transition-colors hover:border-primary hover:bg-surface-elevated"
            @click="openBooking(free.day, slot)"
          >
            {{ slot }}
          </button>
        </div>
      </section>

      <!-- Servicios -->
      <section v-if="business.services?.length" class="mt-md rounded-card bg-surface-card p-md">
        <h2 class="mb-xs text-body-md font-medium normal-case text-on-dark">Servicios</h2>
        <ul class="divide-y divide-hairline-strong">
          <li v-for="service in business.services" :key="service.name" class="flex items-center justify-between py-sm text-body-sm">
            <span class="text-body">{{ service.name }}</span>
            <span class="font-medium tabular-nums text-on-dark">{{ formatMoney(service.price) }}</span>
          </li>
        </ul>
      </section>

      <!-- Reseñas -->
      <!-- Sin padding propio: PostReview ya trae sus márgenes (pasarle mx-0/pt-0 no gana en Tailwind) -->
      <section v-if="business.reviews?.length" class="mt-md rounded-card bg-surface-card pt-md pb-xs">
        <h2 class="px-md text-body-md font-medium normal-case text-on-dark">Lo que dicen los vecinos</h2>
        <PostReview :business="business" :reviews="business.reviews" />
      </section>

      <p class="mt-md flex gap-xs px-xs text-body-xs text-muted">
        <Icon name="material-symbols:payments-outline" size="16" class="shrink-0" aria-hidden="true" />
        El pago se hace directo en el negocio. VECI no cobra comisiones.
      </p>

      <BookingSheet
        v-if="canBook"
        v-model:open="sheetOpen"
        :business="business"
        :initial-day="preset.day"
        :initial-time="preset.time"
      />
    </template>

    <BEmptyState v-else-if="isError" icon="material-symbols:storefront" title="Negocio no encontrado">
      <template #actions><BButton to="/explorar">Explorar negocios</BButton></template>
    </BEmptyState>
    <div v-else class="h-64 animate-pulse rounded-card bg-surface-card" aria-busy="true" />
  </div>
</template>
