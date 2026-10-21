<script setup lang="ts">
/**
 * Pestañas del perfil, como las de una página de Facebook: cada una muestra solo su vista.
 * Viven en la URL (`?tab=`) para poder compartirse, y cambian con `replace` para que "atrás"
 * regrese a la página anterior y no a la pestaña anterior. Sin `tab` = la primera.
 */
const props = defineProps<{ tabs: { id: string, label: string }[] }>()

const route = useRoute()
const active = computed(() => {
  const tab = route.query.tab
  return props.tabs.find((item) => item.id === tab)?.id ?? props.tabs[0]?.id
})

const nav = ref<HTMLElement>()
// Al cambiar de pestaña con la página ya bajada, se sube hasta la barra: se ve el inicio de la vista
// (la barra es `sticky`: su lugar natural se mide desde lo que tiene arriba, la cabecera)
watch(active, () => {
  const bar = nav.value?.parentElement
  const above = bar?.previousElementSibling
  if (!bar || !above) return
  const top = above.getBoundingClientRect().bottom + window.scrollY - (Number.parseFloat(getComputedStyle(bar).top) || 0)
  if (window.scrollY > top) window.scrollTo({ top })
})
</script>

<template>
  <nav ref="nav" aria-label="Secciones del negocio" class="flex overflow-x-auto [scrollbar-width:none]">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.id"
      :to="{ query: { ...route.query, tab: tab.id === tabs[0]?.id ? undefined : tab.id } }"
      replace
      :aria-current="active === tab.id ? 'page' : undefined"
      class="relative shrink-0 px-md py-sm text-label font-semibold whitespace-nowrap transition-colors"
      :class="active === tab.id ? 'text-ink' : 'text-muted hover:text-ink'"
    >
      {{ tab.label }}
      <!-- Activa en blanco, como el resto del sistema (solo neutros) -->
      <span v-if="active === tab.id" class="absolute inset-x-sm bottom-0 h-[2px] rounded-t-full bg-ink" aria-hidden="true" />
    </NuxtLink>
  </nav>
</template>
