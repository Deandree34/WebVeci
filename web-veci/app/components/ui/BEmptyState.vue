<script setup lang="ts">
/** Estado vacío: ícono gris, título en Lora cursiva (la app le habla al vecino) y explicación en Plus Jakarta Sans. */
defineProps<{ icon: string, title: string }>()
</script>

<template>
  <div class="flex flex-col items-center rounded-card bg-surface-card px-lg py-xl text-center">
    <Icon :name="icon" size="40" class="mb-sm text-muted" aria-hidden="true" />
    <p class="font-quote text-[20px] leading-[1.3] font-medium text-ink italic">{{ title }}</p>
    <p v-if="$slots.default" class="mt-xxs max-w-copy font-headline text-[14px] leading-[1.45] font-medium text-body"><slot /></p>
    <div v-if="$slots.actions" class="mt-md"><slot name="actions" /></div>
  </div>
</template>
