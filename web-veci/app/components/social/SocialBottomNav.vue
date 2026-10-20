<script setup lang="ts">
import { bottomNav } from '~/features/navigation/nav'

/**
 * Barra inferior (solo celular): Inicio · Ofertas · Citas (las vistas del feed).
 * Explorar, Mis cosas y Guardados están en el menú de tres puntos del encabezado.
 */
const route = useRoute()

/** Activo si coinciden la ruta y la pestaña del feed (`?tab=`). */
function isActive(to: string) {
  const [path, query = ''] = to.split('?')
  const tab = new URLSearchParams(query).get('tab') ?? undefined
  return route.path === path && (route.query.tab ?? undefined) === tab
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas/95 backdrop-blur md:hidden"
    aria-label="Navegación inferior"
  >
    <ul class="grid grid-cols-3">
      <li v-for="item in bottomNav" :key="item.label">
        <NuxtLink
          :to="item.to"
          class="relative flex flex-col items-center gap-xxs py-sm transition-colors"
          :class="isActive(item.to) ? 'text-on-dark' : 'text-muted'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <Icon :name="isActive(item.to) ? item.activeIcon : item.icon" size="24" aria-hidden="true" />
          <span class="text-body-xs font-medium">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
