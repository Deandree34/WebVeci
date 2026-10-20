<script setup lang="ts">
/**
 * Pestañas del perfil como anclas a las secciones de la misma página (no son rutas):
 * se quedan fijas bajo la barra superior y resaltan la sección que se está leyendo.
 */
/** `mobileOnly`: la sección ya está siempre a la vista en escritorio (columna lateral fija). */
const props = defineProps<{ tabs: { id: string, label: string, mobileOnly?: boolean }[] }>()

/** `''` = "Inicio" (arriba del perfil). */
const active = ref('')

function go(id: string) {
  active.value = id
  if (!id) window.scrollTo({ top: 0, behavior: 'smooth' })
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// La sección activa es la última cuyo inicio ya pasó bajo las pestañas
let observer: IntersectionObserver | undefined
onMounted(() => {
  const desktop = window.matchMedia('(min-width: 768px)')
  const visible = new Set<string>()
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target.id)
      else visible.delete(entry.target.id)
    }
    active.value = window.scrollY < 80 ? '' : (props.tabs.find((tab) => visible.has(tab.id) && !(tab.mobileOnly && desktop.matches))?.id ?? active.value)
  }, { rootMargin: '-120px 0px -55% 0px' })

  for (const tab of props.tabs) {
    const el = document.getElementById(tab.id)
    if (el) observer.observe(el)
  }
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav aria-label="Secciones del negocio" class="flex overflow-x-auto [scrollbar-width:none]">
    <a
      v-for="tab in [{ id: '', label: 'Inicio' }, ...tabs]"
      :key="tab.id"
      :href="`#${tab.id}`"
      :aria-current="active === tab.id ? 'location' : undefined"
      class="relative shrink-0 px-md py-sm font-headline text-[14px] font-semibold whitespace-nowrap transition-colors"
      :class="[
        active === tab.id ? 'text-ink' : 'text-muted hover:text-ink',
        { 'md:hidden': 'mobileOnly' in tab && tab.mobileOnly }
      ]"
      @click.prevent="go(tab.id)"
    >
      {{ tab.label }}
      <!-- Activa en blanco, como el resto del sistema (solo neutros) -->
      <span v-if="active === tab.id" class="absolute inset-x-sm bottom-0 h-[2px] rounded-t-full bg-ink" aria-hidden="true" />
    </a>
  </nav>
</template>
