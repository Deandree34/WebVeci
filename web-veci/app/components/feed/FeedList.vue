<script setup lang="ts">
import type { FeedTab } from '~/api/types'
import { useFeed } from '~/features/feed/queries'

const props = defineProps<{ tab?: FeedTab }>()

const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage, suspense } = useFeed(() => props.tab)
onServerPrefetch(suspense)

const items = computed(() => data.value?.pages.flatMap((page) => page.items) ?? [])

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
    <div v-if="isPending" class="flex flex-col gap-md" aria-busy="true">
      <div v-for="n in 2" :key="n" class="h-48 animate-pulse rounded-card bg-surface-card" />
    </div>

    <p v-else-if="isError" class="text-body-sm text-muted">No se pudo cargar el feed.</p>

    <template v-else>
      <div class="flex flex-col gap-md">
        <FeedPostCard v-for="item in items" :key="item.id" :item="item" />
      </div>

      <div class="mt-xl flex justify-center">
        <BButton v-if="hasNextPage" :disabled="isFetchingNextPage" @click="fetchNextPage()">
          {{ isFetchingNextPage ? 'Cargando…' : 'Ver más' }}
        </BButton>
        <div v-else class="flex flex-col items-center text-center">
          <Icon name="material-symbols:check-circle" size="32" class="mb-xs text-success" aria-hidden="true" />
          <p class="text-body-md font-medium text-on-dark">Estás al día con tu colonia</p>
          <p class="text-body-sm text-muted">{{ comeBackText }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
