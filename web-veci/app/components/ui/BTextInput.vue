<script setup lang="ts">
defineProps<{ label: string, type?: string, placeholder?: string }>()
const model = defineModel<string>()
const id = useId()
</script>

<template>
  <div class="flex flex-col">
    <label :for="id" class="type-caption text-muted">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      class="h-11 rounded-none border-b border-hairline-strong bg-transparent py-sm text-body-md text-on-dark placeholder:text-muted-soft focus:border-primary focus:outline-none"
    >
  </div>
</template>
