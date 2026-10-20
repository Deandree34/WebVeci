<script setup lang="ts">
import { useCategories } from '~/features/categories/queries'
import { categoryPath, mainNav } from '~/features/navigation/nav'

const counters = useNavCounters()
const { data: categories } = useCategories()

const available = computed(() => categories.value?.filter((category) => category.available) ?? [])
const upcoming = computed(() => categories.value?.filter((category) => !category.available) ?? [])
</script>

<template>
  <nav
    class="sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-col gap-xxs overflow-y-auto py-lg md:flex"
    aria-label="Navegación principal"
  >
    <SocialNavItem
      v-for="item in mainNav"
      :key="item.label"
      :icon="item.icon"
      :active-icon="item.activeIcon"
      :label="item.label"
      :to="item.to"
      :badge="item.counter ? counters[item.counter] || undefined : undefined"
    />

    <!-- Categorías: arriba las disponibles; las que vienen, agrupadas y plegadas (tablet: solo iconos de las disponibles) -->
    <!-- Rótulo en Lora cursiva, igual que "Abierto ahora" y "Próximos avisos" de la columna derecha -->
    <p class="mt-lg mb-xxs hidden px-sm font-quote text-[16px] font-medium text-body italic lg:block">Categorías</p>
    <hr class="my-sm border-hairline lg:hidden">

    <SocialNavItem
      v-for="category in available"
      :key="category.id"
      :icon="category.icon"
      :label="category.label"
      :to="categoryPath(category.slug)"
    />

    <details v-if="upcoming.length" class="group hidden lg:block">
      <summary class="flex cursor-pointer list-none items-center gap-md rounded-control px-sm py-sm text-muted transition-colors hover:bg-surface-soft hover:text-on-dark [&::-webkit-details-marker]:hidden">
        <Icon name="material-symbols:hourglass-empty" size="24" class="shrink-0" aria-hidden="true" />
        <span class="font-headline text-[15px] font-medium">Próximamente</span>
        <span class="font-headline text-[13px] font-medium text-muted-soft">· {{ upcoming.length }}</span>
        <Icon name="material-symbols:expand-more" size="20" class="ml-auto shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul class="mt-xxs flex flex-col">
        <li
          v-for="category in upcoming"
          :key="category.id"
          class="flex items-center gap-md py-xs pr-sm pl-lg text-muted-soft"
          :title="`${category.label} · Próximamente`"
        >
          <Icon :name="category.icon" size="20" class="shrink-0" aria-hidden="true" />
          <span class="truncate font-headline text-[13px] font-medium">{{ category.label }}</span>
        </li>
      </ul>
    </details>
  </nav>
</template>
