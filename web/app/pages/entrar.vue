<script setup lang="ts">
/** Acceso (`/entrar`): pantalla completa, sin el shell social. `?redirect=` indica a dónde volver. */
definePageMeta({ layout: false })

useHead({ title: 'Entrar — VECI' })
</script>

<template>
  <main class="relative flex min-h-dvh items-center justify-center overflow-hidden bg-canvas py-xl">
    <AuthStage />
    <AuthCard class="relative" />
  </main>
</template>
