<script setup lang="ts">
import { bottomNav } from '~/features/navigation/nav'

const route = useRoute()
const counters = useNavCounters()

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
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
          <Icon :name="item.icon" size="24" aria-hidden="true" />
          <span class="text-body-xs font-medium">{{ item.label }}</span>
          <span
            v-if="item.counter && counters[item.counter]"
            class="absolute top-xxs left-1/2 ml-xs min-w-4 rounded-pill bg-veci-pink px-xxs text-center text-[10px] font-medium leading-4 text-on-accent"
          >
            {{ counters[item.counter] }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
