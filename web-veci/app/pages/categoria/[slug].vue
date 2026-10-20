<script setup lang="ts">
import { useBusinesses } from '~/features/businesses/queries'
import { useCategories } from '~/features/categories/queries'

definePageMeta({ layout: 'social' })

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: categories, suspense: categoriesReady } = useCategories()
const { data: businesses, isPending, suspense: businessesReady } = useBusinesses(slug)

const category = computed(() => categories.value?.find((item) => item.slug === slug.value))

// En SSR se esperan los datos para que el HTML llegue completo y, si no existe, responder 404
if (import.meta.server) {
  await Promise.all([categoriesReady(), businessesReady()]).catch(() => {})
  if (!category.value) setResponseStatus(useRequestEvent()!, 404, 'Categoría no encontrada')
}

useHead({ title: () => `${category.value?.label ?? 'Categoría'} — VECI` })

const onlyOpen = ref(false)
const now = useNow()
const visible = computed(() =>
  (businesses.value ?? []).filter((business) => !onlyOpen.value || scheduleStatus(business, now.value).open)
)
</script>

<template>
  <div>
    <template v-if="category">
      <SocialPageHeader
        :title="category.label"
        :description="category.subcategories.join(' · ')"
        :icon="category.icon"
      />

      <template v-if="category.available">
        <div class="mb-md flex gap-xs" role="group" aria-label="Filtros">
          <button
            type="button"
            class="rounded-pill px-md py-xs text-body-sm font-medium transition-colors"
            :class="onlyOpen ? 'bg-surface-card text-muted hover:text-on-dark' : 'bg-on-dark text-canvas'"
            :aria-pressed="!onlyOpen"
            @click="onlyOpen = false"
          >
            Todos
          </button>
          <button
            type="button"
            class="rounded-pill px-md py-xs text-body-sm font-medium transition-colors"
            :class="onlyOpen ? 'bg-on-dark text-canvas' : 'bg-surface-card text-muted hover:text-on-dark'"
            :aria-pressed="onlyOpen"
            @click="onlyOpen = true"
          >
            Abierto ahora
          </button>
        </div>

        <p v-if="isPending" class="text-body-sm text-muted">Cargando…</p>
        <ul v-else-if="visible.length" class="flex flex-col gap-xxs rounded-card bg-surface-card p-xs">
          <li v-for="business in visible" :key="business.id">
            <BusinessRow :business="business" />
          </li>
        </ul>
        <BEmptyState v-else icon="material-symbols:schedule" title="Nada abierto en este momento">
          Quita el filtro para ver todos los negocios de la categoría.
        </BEmptyState>
      </template>

      <BEmptyState v-else :icon="category.icon" title="Próximamente">
        Estamos sumando los negocios de {{ category.label.toLowerCase() }} de tu colonia.
      </BEmptyState>
    </template>

    <BEmptyState v-else-if="categories" icon="material-symbols:search" title="Categoría no encontrada">
      <template #actions><BButton to="/explorar">Ver categorías</BButton></template>
    </BEmptyState>
  </div>
</template>
