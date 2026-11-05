<script setup lang="ts">
import type { BookingRequest } from '~/api/types'
import { useBusiness } from '#layers/business/queries'
import { useBusinessPosts } from '#layers/feed/queries'

/**
 * Perfil de un negocio (`/negocio/:slug`): cabecera, pestañas (Todo · Reseñas) y, en Todo, dos
 * columnas: horarios libres, ofertas y servicios fijos a la izquierda; sus publicaciones a la derecha.
 * "Apartar cita" se abre desde un horario, un servicio, `?dia=&hora=` (feed) o `?cita=1` (historias).
 *
 * Todas las llamadas a composables son síncronas; la espera de SSR va en `ssrPrefetch()`,
 * que la página llama con `await` (así Nuxt conserva su contexto).
 */

type Day = BookingRequest['day']

interface BookingPreset {
  day?: Day
  time?: string
  service?: string
}

definePageMeta({ layout: 'profile' })

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.slug))
const event = import.meta.server ? useRequestEvent() : undefined

const { data: business, isError, suspense } = useBusiness(slug)
useHead({ title: () => `${business.value?.name ?? 'Negocio'} — VECI` })

const now = useNow()
const free = computed(() => {
  const availability = business.value?.availability
  if (!availability) return undefined
  return freeSlots(availability, colonyHour(now.value))
})
const offers = computed(() => (business.value ? activePromos(business.value, now.value) : []))
const offersTitle = computed(() => (offers.value.length === 1 ? 'Oferta' : 'Ofertas'))
const canBook = computed(() => {
  const b = business.value
  return !!b && b.capabilities.includes('citas') && !!b.availability
})

// Las pestañas se pegan bajo la barra superior; si la barra se esconde (celular), suben a `top-0`
const topBarHidden = useTopBarHidden()
const tabsBarClass = computed(() => (topBarHidden.value ? 'top-0 md:top-14' : 'top-14'))

/** Pestañas: Todo siempre (horarios, oferta, servicios y publicaciones); Reseñas solo si las hay. */
const tabs = computed(() => {
  const b = business.value
  if (!b) return []
  const list = [{ id: 'todo', label: 'Todo' }]
  if (b.reviews?.length) list.push({ id: 'resenas', label: 'Reseñas' })
  return list
})
/** Vista actual (`?tab=`); una pestaña desconocida o sin contenido cae en Todo. */
const view = computed(() => {
  const found = tabs.value.find((tab) => tab.id === route.query.tab)
  return found ? found.id : 'todo'
})

const { data: allPosts, isPending: postsPending, suspense: postsSuspense } = useBusinessPosts(() => business.value?.id)
/** La oferta vive fija en la columna izquierda: aquí no se repite como post. */
const posts = computed(() => allPosts.value?.filter((item) => item.type !== 'oferta'))

/** En SSR se esperan el negocio (404 si no existe) y sus publicaciones, para que el HTML llegue completo. */
async function ssrPrefetch() {
  if (!import.meta.server) return
  await suspense().catch(() => {})
  if (isError.value && event) setResponseStatus(event, 404, 'Negocio no encontrado')
  // Si no, el navegador recibe la consulta de publicaciones a medias
  if (business.value) await postsSuspense().catch(() => {})
}

/* ---------- Apartar cita ---------- */
const sheetOpen = ref(false)
const preset = ref<BookingPreset>({})

function openBooking(day?: Day, time?: string, service?: string) {
  preset.value = { day, time, service }
  sheetOpen.value = true
}

/** "Apartar cita" de la cabecera: el primer día con lugar. */
function bookFirstFree() {
  openBooking(free.value?.day)
}

/** Desde un horario de "Horarios libres". */
function bookSlot(day: Day, time: string) {
  openBooking(day, time)
}

/** Desde "Apartar" de un servicio. */
function bookService(service: string) {
  openBooking(free.value?.day, undefined, service)
}

// Espera a tener el negocio (al navegar en el cliente aún puede estar cargando) y aplica una sola vez
let presetApplied = false
onMounted(() => {
  watch(canBook, (ready) => {
    if (!ready || presetApplied) return
    presetApplied = true
    const { dia, hora, cita } = route.query
    if ((dia === 'today' || dia === 'tomorrow') && typeof hora === 'string') openBooking(dia, hora)
    else if (cita !== undefined) bookFirstFree()
  }, { immediate: true })
})

// Al cerrar, se limpia la preselección de la URL para que "atrás" no reabra el panel
watch(sheetOpen, (isOpen) => {
  const { dia, hora, cita } = route.query
  if (isOpen || (!dia && !hora && cita === undefined)) return
  router.replace({ query: { ...route.query, dia: undefined, hora: undefined, cita: undefined } })
})

/** Regresar: a la página anterior dentro de la app; si se entró directo al perfil (enlace compartido), al feed. */
function goBack() {
  if (window.history.state?.back) router.back()
  else navigateTo('/')
}

await ssrPrefetch()
</script>

<template>
  <div>
    <template v-if="business">
      <!-- Cabecera: portada + quién es, si está abierto, cifras y acciones -->
      <section class="relative bg-surface-card md:rounded-b-card" aria-labelledby="business-name">
        <!-- Regresar, sobre la portada: solo la flecha en blanco, con sombra suave para leerse sobre foto o
             ocre; el área de toque sigue siendo de 40px -->
        <button
          type="button"
          aria-label="Regresar"
          class="absolute top-sm left-sm z-10 inline-flex size-10 items-center justify-center text-ink drop-shadow-[0_1px_3px_rgb(0_0_0/0.55)] transition-opacity hover:opacity-75 md:top-md md:left-md"
          @click="goBack"
        >
          <Icon name="material-symbols:arrow-back-rounded" size="28" aria-hidden="true" />
        </button>
        <BusinessCover :src="business.coverUrl" :icon="business.icon" />
        <BusinessProfileHeader :business="business" :can-book="canBook" @book="bookFirstFree" />
      </section>

      <!-- Pestañas fijas bajo la barra superior: cada una muestra solo su vista -->
      <div
        class="sticky z-20 mt-xxs transition-[top] duration-200 bg-surface-card px-xs md:rounded-card md:px-md"
        :class="tabsBarClass"
      >
        <BusinessProfileTabs :tabs="tabs" />
      </div>

      <!-- Todo: desde lg, dos columnas. Izquierda fija al bajar (lo importante siempre a la vista:
           horarios libres, oferta y servicios); derecha, las publicaciones. En celular, una sola columna. -->
      <div
        v-if="view === 'todo'"
        class="mt-md grid grid-cols-1 items-start gap-md px-md md:px-0 lg:grid-cols-[400px_minmax(0,1fr)]"
      >
        <aside
          class="flex flex-col gap-md lg:sticky lg:top-[120px] lg:max-h-[calc(100dvh-136px)] lg:overflow-y-auto lg:[scrollbar-width:thin]"
          aria-label="Lo importante del negocio"
        >
          <BusinessSlotsCard
            v-if="canBook"
            :availability="business.availability!"
            :schedule="business"
            @pick="bookSlot"
          />

          <!-- Ofertas vigentes: el mismo adjunto que en el feed, sin botón (ya estás en el negocio) -->
          <BusinessProfileCard v-if="offers.length" id="oferta" :title="offersTitle">
            <div class="-mx-md -mb-sm">
              <PostOffer v-for="promo in offers" :key="promo.text" :promo="promo" />
            </div>
          </BusinessProfileCard>

          <BusinessServicesCard
            v-if="business.services?.length"
            :business="business"
            :can-book="canBook"
            @book="bookService"
          />
        </aside>

        <!-- Publicaciones del negocio (la oferta ya está fija a la izquierda) -->
        <div class="flex min-w-0 flex-col gap-md">
          <template v-if="postsPending">
            <div v-for="n in 2" :key="n" class="h-64 animate-pulse rounded-card bg-surface-card" aria-hidden="true" />
          </template>
          <template v-else-if="posts?.length">
            <FeedPostCard v-for="item in posts" :key="item.id" :item="item" />
          </template>
          <BEmptyState v-else icon="material-symbols:campaign" title="Todavía no ha publicado nada">
            Cuando {{ business.name }} publique algo, aparecerá aquí.
          </BEmptyState>
        </div>
      </div>

      <!-- Reseñas: una sola columna del ancho del feed -->
      <div v-else class="mx-auto mt-md flex w-full max-w-[680px] flex-col gap-md px-md md:px-0">
        <BusinessReviewsCard :business="business" />
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
      <div class="mt-md grid grid-cols-1 gap-md px-md md:px-0 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div class="h-64 rounded-card bg-surface-card" />
        <div class="h-96 rounded-card bg-surface-card" />
      </div>
    </div>
  </div>
</template>
