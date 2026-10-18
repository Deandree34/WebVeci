<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-hairline bg-canvas py-xxl text-body-sm text-muted">
    <div class="container-content flex flex-col gap-xl md:flex-row md:items-center md:justify-between">
      <BWordmark size="md" />
      <p>© {{ year }} VECI. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>
