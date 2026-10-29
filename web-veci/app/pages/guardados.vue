<script setup lang="ts">
import type { Business } from '~/api/types'
import { useBusinesses } from '#layers/business/queries'
import { useSavedStore } from '#layers/business/stores'

/** Guardados: los lugares de confianza del vecino (solo los ve él), del más reciente al más antiguo. */

definePageMeta({ layout: 'social' })

useHead({ title: 'Guardados — VECI' })

const saved = useSavedStore()
const { data: businesses } = useBusinesses()

const list = computed(() => {
  const result: Business[] = []
  for (const id of saved.ids) {
    const business = businesses.value?.find((item) => item.id === id)
    if (business) result.push(business)
  }
  return result
})

function remove(businessId: string) {
  saved.toggle(businessId)
}
</script>

<template>
  <div>
    <SocialPageHeader title="Guardados" description="Tus lugares de confianza; solo los ves tú." />

    <ul v-if="list.length" class="flex flex-col gap-xxs rounded-card bg-surface-card p-xs">
      <li v-for="business in list" :key="business.id" class="flex items-center gap-xs">
        <BusinessRow :business="business" class="min-w-0 flex-1" />
        <BIconButton label="Quitar de guardados" @click="remove(business.id)">
          <Icon name="material-symbols:bookmark" size="22" class="text-ink" />
        </BIconButton>
      </li>
    </ul>
    <BEmptyState v-else icon="material-symbols:bookmark-outline" title="Aún no guardas lugares">
      Toca el marcador de cualquier negocio para tener tus lugares de confianza a la mano.
    </BEmptyState>
  </div>
</template>
