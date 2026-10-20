<script setup lang="ts">
import type { FeedTab } from '~/api/types'
import { useFeed } from '~/features/feed/queries'

const props = defineProps<{ tab?: FeedTab }>()

const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError, suspense } = useFeed(() => props.tab)
onServerPrefetch(suspense)

const items = computed(() => data.value?.pages.flatMap((page) => page.items) ?? [])

/*
 * Carga automática: un centinela al final de la lista. Se guarda si está a la vista y la
 * decisión la toma un watchEffect, así también se vuelve a cargar si tras una página corta
 * el centinela sigue visible (el observer no avisa de nuevo si no cambia la intersección).
 */
const sentinel = ref<HTMLElement>()
const sentinelVisible = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => (sentinelVisible.value = !!entry?.isIntersecting), { rootMargin: '400px' })
  watch(sentinel, (el, old) => {
    if (old) observer!.unobserve(old)
    if (el) observer!.observe(el)
    else sentinelVisible.value = false
  }, { immediate: true })
})
onBeforeUnmount(() => observer?.disconnect())

watchEffect(() => {
  if (sentinelVisible.value && hasNextPage.value && !isFetchingNextPage.value && !isFetchNextPageError.value) fetchNextPage()
})

const now = useNow()
const comeBack = {
  morning: 'Vuelve en la tarde para ver lo nuevo de la colonia.',
  afternoon: 'Vuelve en la noche: siempre hay horarios que se liberan.',
  night: 'Mañana temprano habrá novedades.'
} as const
const comeBackText = computed(() => comeBack[dayPart(colonyHour(now.value))])
</script>

<template>
  <div>
    <!-- Cargando la primera página -->
    <div v-if="isPending" class="flex flex-col gap-xs sm:gap-md" aria-busy="true">
      <div v-for="n in 2" :key="n" class="-mx-md h-48 animate-pulse bg-surface-card sm:mx-0 sm:rounded-control" />
    </div>

    <p v-else-if="isError" class="font-headline text-[14px] font-medium text-body">No se pudo cargar el feed.</p>

    <template v-else>
      <div class="flex flex-col gap-xs sm:gap-md">
        <FeedPostCard v-for="item in items" :key="item.id" :item="item" />
      </div>

      <template v-if="hasNextPage">
        <!-- Siguiente página en camino -->
        <div v-if="isFetchingNextPage" class="-mx-md mt-xs h-48 animate-pulse bg-surface-card sm:mx-0 sm:mt-md sm:rounded-control" aria-busy="true" />
        <p v-else-if="isFetchNextPageError" class="mt-lg text-center font-headline text-[14px] font-medium text-body">
          No se pudo cargar más ·
          <button type="button" class="font-semibold text-ink underline-offset-2 hover:underline" @click="fetchNextPage()">Reintentar</button>
        </p>
        <div ref="sentinel" aria-hidden="true" />
      </template>

      <div v-else class="mt-lg flex flex-col items-center text-center">
        <!-- Cierre del feed: la app le habla al vecino en Lora cursiva; palomita en blanco (sin verde) -->
        <span class="mb-xs inline-flex size-9 items-center justify-center rounded-full bg-surface-elevated text-ink" aria-hidden="true">
          <Icon name="material-symbols:check-rounded" size="20" />
        </span>
        <p class="font-quote text-[18px] font-medium text-ink italic">Estás al día con tu colonia</p>
        <p class="mt-0.5 font-headline text-[13px] font-medium text-body">{{ comeBackText }}</p>
        <!-- Sin columna derecha (< xl), el pie legal va aquí, al final del feed -->
        <SocialLegal class="mt-lg xl:hidden" />
      </div>
    </template>
  </div>
</template>
