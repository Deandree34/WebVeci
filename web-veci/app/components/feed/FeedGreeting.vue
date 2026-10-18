<script setup lang="ts">
const now = useNow()

const greetings = {
  morning: { text: 'Buenos días, vecino', icon: 'material-symbols:wb-sunny' },
  afternoon: { text: 'Buenas tardes, vecino', icon: 'material-symbols:partly-cloudy-day' },
  night: { text: 'Buenas noches, vecino', icon: 'material-symbols:bedtime' }
} as const
const greeting = computed(() => greetings[dayPart(colonyHour(now.value))])
</script>

<template>
  <div class="mb-md">
    <h1 class="flex items-center gap-xs text-title-md font-medium normal-case tracking-normal text-ink">
      {{ greeting.text }}
      <Icon :name="greeting.icon" size="24" class="text-warning" aria-hidden="true" />
    </h1>
    <p class="text-body-sm text-muted">Esto pasa hoy en la Col. Centro.</p>
  </div>
</template>
