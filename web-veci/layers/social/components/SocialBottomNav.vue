<script setup lang="ts">
import type { SocialNavLink } from '../nav'
import { bottomNav } from '../nav'

/**
 * Barra inferior (solo celular): Inicio · Ofertas · Citas · Notificaciones (las vistas del inicio),
 * con el contador ocre de las notificaciones sin leer.
 * Explorar, Mis cosas y Guardados están en el menú de tres puntos del encabezado.
 */

const route = useRoute()
const counters = useNavCounters()

/** Activo si coinciden la ruta y la pestaña del feed (`?tab=`). */
function isActive(item: SocialNavLink) {
  const [path, query = ''] = item.to.split('?')
  const tab = new URLSearchParams(query).get('tab') ?? undefined
  return route.path === path && (route.query.tab ?? undefined) === tab
}

function iconFor(item: SocialNavLink) {
  return isActive(item) ? item.activeIcon : item.icon
}

/** Cuántos sin leer muestra el ítem (0 = sin contador). */
function countFor(item: SocialNavLink) {
  if (!item.counter) return 0
  return counters[item.counter]
}

const items = bottomNav
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas/95 backdrop-blur md:hidden"
    aria-label="Navegación inferior"
  >
    <ul class="grid grid-cols-4">
      <li v-for="item in items" :key="item.label">
        <NuxtLink
          :to="item.to"
          class="relative flex flex-col items-center gap-xxs py-sm transition-colors"
          :class="isActive(item) ? 'text-on-dark' : 'text-muted'"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <Icon :name="iconFor(item)" size="24" aria-hidden="true" />
          <!-- 11px como en la barra de Facebook: "Notificaciones" cabe con aire en un cuarto de pantalla -->
          <span class="text-caption font-medium">{{ item.label }}</span>
          <BCounter
            v-if="countFor(item)"
            :value="countFor(item)"
            class="absolute top-xxs left-1/2 ml-xxs"
            :aria-label="`${countFor(item)} sin leer`"
          />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
