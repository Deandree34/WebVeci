<script setup lang="ts">
import { bottomNav } from '~/features/navigation/nav'

/**
 * Barra inferior (solo celular): Inicio · Ofertas · Citas · Notificaciones (las vistas del inicio),
 * con el contador neutro de las notificaciones sin leer.
 * Explorar, Mis cosas y Guardados están en el menú de tres puntos del encabezado.
 */
const route = useRoute()
const counters = useNavCounters()

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
    <ul class="grid grid-cols-4">
      <li v-for="item in bottomNav" :key="item.label">
        <NuxtLink
          :to="item.to"
          class="relative flex flex-col items-center gap-xxs py-sm transition-colors"
          :class="isActive(item.to) ? 'text-on-dark' : 'text-muted'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <Icon :name="isActive(item.to) ? item.activeIcon : item.icon" size="24" aria-hidden="true" />
          <!-- 11px como en la barra de Facebook: "Notificaciones" cabe con aire en un cuarto de pantalla -->
          <span class="text-caption font-medium">{{ item.label }}</span>
          <span
            v-if="item.counter && counters[item.counter]"
            class="absolute top-xxs left-1/2 ml-xxs min-w-[18px] rounded-pill bg-ink px-xxs text-center font-headline text-tiny leading-[18px] font-bold text-canvas"
            :aria-label="`${counters[item.counter]} sin leer`"
          >{{ counters[item.counter] }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
