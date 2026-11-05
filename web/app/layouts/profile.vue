<script setup lang="ts">
/** Perfil a todo lo ancho (portada + dos columnas), sin las barras laterales del feed. */
await useShellPrefetch()
</script>

<template>
  <div class="min-h-screen bg-canvas pb-14 md:pb-0">
    <SocialTopBar />

    <main class="mx-auto w-full max-w-[1100px] pb-lg md:px-md">
      <slot />
    </main>

    <SocialBottomNav />
  </div>
</template>
