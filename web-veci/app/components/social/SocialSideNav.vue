<script setup lang="ts">
import { useCategories } from '~/features/categories/queries'
import { categoryPath, mainNav } from '~/features/navigation/nav'

const counters = useNavCounters()
const { data: categories } = useCategories()
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
      :label="item.label"
      :to="item.to"
      :badge="item.counter ? counters[item.counter] || undefined : undefined"
    />

    <!-- Explorar por categoría: escritorio muestra todas; tablet solo iconos de las disponibles -->
    <p class="mt-lg mb-xs hidden px-sm text-body-sm font-medium text-muted lg:block">Explorar por categoría</p>
    <hr class="my-sm border-hairline lg:hidden">

    <template v-for="category in categories" :key="category.id">
      <SocialNavItem
        v-if="category.available"
        :icon="category.icon"
        :label="category.label"
        :to="categoryPath(category.slug)"
      />
      <span
        v-else
        class="hidden items-center gap-md px-sm py-xs text-muted-soft lg:flex"
        :title="`${category.label} · Próximamente`"
      >
        <Icon :name="category.icon" size="22" class="shrink-0" aria-hidden="true" />
        <span class="truncate text-body-sm">{{ category.label }}</span>
        <span class="ml-auto shrink-0 text-body-xs">Pronto</span>
      </span>
    </template>

    <p class="mt-auto hidden px-sm pt-lg text-body-xs text-muted-soft lg:block">
      VECI · Hecho por y para la colonia
    </p>
  </nav>
</template>
