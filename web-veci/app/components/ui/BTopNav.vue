<script setup lang="ts">
const links = [
  { label: 'Inicio', to: '/' }
]

const open = ref(false)
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-20 bg-transparent text-on-dark">
    <nav class="container-content flex h-14 items-center justify-between">
      <BWordmark />

      <ul class="hidden gap-xl md:flex">
        <li v-for="link in links" :key="link.to">
          <NuxtLink :to="link.to" class="type-nav text-on-dark hover:text-muted">{{ link.label }}</NuxtLink>
        </li>
      </ul>

      <BIconButton class="md:hidden" :label="open ? 'Cerrar menú' : 'Abrir menú'" @click="open = !open">
        <Icon :name="open ? 'material-symbols:close' : 'material-symbols:menu'" />
      </BIconButton>
    </nav>

    <ul v-if="open" class="container-content flex flex-col gap-md border-t border-hairline bg-canvas py-lg md:hidden">
      <li v-for="link in links" :key="link.to">
        <NuxtLink :to="link.to" class="type-nav text-on-dark" @click="open = false">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </header>
</template>
