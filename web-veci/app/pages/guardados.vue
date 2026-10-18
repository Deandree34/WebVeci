<script setup lang="ts">
import type { Business } from '~/api/types'
import { useBusinesses } from '~/features/businesses/queries'
import { useSavedStore } from '~/stores/saved'

definePageMeta({ layout: 'social' })
useHead({ title: 'Guardados — VECI' })

const saved = useSavedStore()
const { data: businesses } = useBusinesses()

const list = computed(() =>
  saved.ids.map((id) => businesses.value?.find((business) => business.id === id)).filter((business): business is Business => !!business)
)
</script>

<template>
  <div>
    <SocialPageHeader title="Guardados" description="Tus lugares de confianza; solo los ves tú." />

    <ul v-if="list.length" class="flex flex-col gap-xxs rounded-card bg-surface-card p-xs">
      <li v-for="business in list" :key="business.id" class="flex items-center gap-xs">
        <BusinessRow :business="business" class="min-w-0 flex-1" />
        <BIconButton label="Quitar de guardados" @click="saved.toggle(business.id)">
          <Icon name="material-symbols:bookmark" size="22" class="text-veci-purple-text" />
        </BIconButton>
      </li>
    </ul>
    <BEmptyState v-else icon="material-symbols:bookmark-outline" title="Aún no guardas lugares">
      Toca el marcador de cualquier negocio para tener tus lugares de confianza a la mano.
    </BEmptyState>
  </div>
</template>
