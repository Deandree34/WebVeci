<script setup lang="ts">
import type { BookingRequest } from '~/api/types'
import { useBusiness } from '~/features/businesses/queries'

definePageMeta({ layout: 'profile' })

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
const topBarHidden = useTopBarHidden()
const canBook = computed(() => !!business.value?.capabilities.includes('citas') && !!business.value.availability)

/** Pestañas: solo las secciones que este negocio sí tiene. */
const tabs = computed(() => {
  const b = business.value
  if (!b) return []
  return [
    { id: 'servicios', label: 'Servicios', show: !!b.services?.length },
    { id: 'resenas', label: 'Reseñas', show: !!b.reviews?.length },
    // En escritorio la columna lateral siempre está a la vista: la pestaña solo hace falta en móvil
    { id: 'horario', label: 'Información', show: true, mobileOnly: true }
  ].filter((tab) => tab.show)
})

/* ---------- Apartar cita: desde un horario, con `?dia=&hora=` (feed) o `?cita=1` (historias) ---------- */
const sheetOpen = ref(false)
const preset = ref<{ day?: BookingRequest['day'], time?: string, service?: string }>({})

function openBooking(day?: BookingRequest['day'], time?: string, service?: string) {
  preset.value = { day, time, service }
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
      <!-- Cabecera: portada + quién es, si está abierto, cifras y acciones -->
      <section class="bg-surface-card md:rounded-b-card" aria-labelledby="business-name">
        <BusinessCover :src="business.coverUrl" :icon="business.icon" />
        <BusinessProfileHeader :business="business" :can-book="canBook" @book="openBooking(free?.day)" />
      </section>

      <!-- Pestañas fijas bajo la barra superior (anclas a las secciones de abajo) -->
      <div
        class="sticky z-20 mt-xxs transition-[top] duration-200 bg-surface-card px-xs md:rounded-card md:px-md"
        :class="topBarHidden ? 'top-0 md:top-14' : 'top-14'"
      >
        <BusinessProfileTabs :tabs="tabs" />
      </div>

      <!-- Columna ancha: lo que se hace hoy (apartar, oferta, precios, reseñas).
           Lateral: datos de consulta (horario, ubicación, pago); en móvil va al final. -->
      <div class="mt-md grid grid-cols-1 items-start gap-md px-md md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:px-0">
        <div class="flex flex-col gap-md">
          <BusinessSlotsCard v-if="canBook" :availability="business.availability!" @pick="(day, time) => openBooking(day, time)" />

          <!-- Oferta: el mismo foco que en el feed -->
          <section v-if="business.promo" id="oferta" class="scroll-mt-[120px] overflow-hidden rounded-card bg-surface-card pt-sm" aria-label="Oferta">
            <PostOffer :promo="business.promo" />
          </section>

          <BusinessServicesCard
            v-if="business.services?.length"
            :business="business"
            :can-book="canBook"
            @book="(service) => openBooking(free?.day, undefined, service)"
          />

          <BusinessReviewsCard v-if="business.reviews?.length" :business="business" />
        </div>

        <aside class="flex flex-col gap-md md:sticky md:top-[120px]" aria-label="Información del negocio">
          <BusinessHoursCard :business="business" />
          <BusinessLocationCard :business="business" />
        </aside>
      </div>

      <BookingSheet
        v-if="canBook"
        v-model:open="sheetOpen"
        :business="business"
        :initial-day="preset.day"
        :initial-time="preset.time"
        :initial-service="preset.service"
      />
    </template>

    <BEmptyState v-else-if="isError" icon="material-symbols:storefront" title="Negocio no encontrado" class="mt-lg">
      <template #actions><BButton to="/explorar">Explorar negocios</BButton></template>
    </BEmptyState>

    <!-- Esqueleto con la forma del perfil -->
    <div v-else class="animate-pulse" aria-busy="true">
      <div class="bg-surface-card pb-lg md:rounded-b-card">
        <div class="h-40 bg-surface-elevated md:h-72 md:rounded-b-card" />
        <div class="flex flex-col items-center gap-sm px-md md:flex-row md:items-end md:px-lg">
          <div class="-mt-16 size-28 shrink-0 rounded-full border-4 border-surface-card bg-surface-elevated md:-mt-20 md:size-36" />
          <div class="flex w-full flex-col items-center gap-xs md:items-start">
            <div class="h-7 w-56 rounded-control bg-surface-elevated" />
            <div class="h-4 w-72 max-w-full rounded-control bg-surface-elevated" />
          </div>
        </div>
      </div>
      <div class="mt-md grid grid-cols-1 gap-md px-md md:grid-cols-[3fr_2fr] md:px-0">
        <div class="h-64 rounded-card bg-surface-card" />
        <div class="h-48 rounded-card bg-surface-card" />
      </div>
    </div>
  </div>
</template>
