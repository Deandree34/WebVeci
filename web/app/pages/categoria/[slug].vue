<script setup lang="ts">
import { useBusinesses } from '#layers/business/queries'
import { useCategories } from '#layers/category/queries'

/**
 * Página de una categoría (`/categoria/:slug`): sus negocios, con el filtro "Abierto ahora".
 * Si la categoría aún no está disponible, "Próximamente"; si no existe, 404.
 *
 * Todas las llamadas a composables son síncronas; la espera de SSR va en `ssrPrefetch()`,
 * que la página llama con `await` (así Nuxt conserva su contexto).
 */

type Filter = 'all' | 'open'

const FILTERS: { value: Filter, label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abierto ahora' }
]

definePageMeta({ layout: 'social' })

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const event = import.meta.server ? useRequestEvent() : undefined

const { data: categories, suspense: categoriesReady } = useCategories()
const { data: businesses, isPending, suspense: businessesReady } = useBusinesses(slug)

const category = computed(() => categories.value?.find((item) => item.slug === slug.value))
const description = computed(() => category.value?.subcategories.join(' · '))

useHead({ title: () => `${category.value?.label ?? 'Categoría'} — VECI` })

const filter = ref<Filter>('all')
const now = useNow()
const visible = computed(() => {
  const list = businesses.value ?? []
  if (filter.value === 'all') return list
  return list.filter((business) => scheduleStatus(business, now.value).open)
})

/** En SSR se esperan los datos para que el HTML llegue completo y, si no existe, responder 404. */
async function ssrPrefetch() {
  if (!import.meta.server) return
  await Promise.all([categoriesReady(), businessesReady()]).catch(() => {})
  if (!category.value && event) setResponseStatus(event, 404, 'Categoría no encontrada')
}

const filters = FILTERS

await ssrPrefetch()
</script>

<template>
  <div>
    <template v-if="category">
      <SocialPageHeader
        :title="category.label"
        :description="description"
        :icon="category.icon"
      />

      <template v-if="category.available">
        <BSegmented v-model="filter" :options="filters" label="Filtros" class="mb-md" />

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
