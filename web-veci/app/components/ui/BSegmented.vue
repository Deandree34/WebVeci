<script setup lang="ts" generic="T extends string">
/** Una opción del selector; `hint` es un dato corto junto a la etiqueta ("4 libres"). */
interface SegmentedOption<V extends string = string> {
  value: V
  label: string
  hint?: string
}

/**
 * Selector de una opción entre pocas (Hoy / Mañana, Todos / Abierto ahora). Lo elegido en blanco.
 *  - `chips` (por defecto): píldoras sueltas.
 *  - `track`: las opciones repartidas dentro de un riel con borde, como pestañas.
 * `label` describe el grupo para lectores de pantalla.
 */
interface BSegmentedProps<V extends string = string> {
  options: SegmentedOption<V>[]
  label: string
  variant?: 'chips' | 'track'
}

const props = defineProps<BSegmentedProps<T>>()
const model = defineModel<T>({ required: true })

const track = computed(() => props.variant === 'track')

const groupClass = computed(() => {
  if (track.value) return 'grid grid-flow-col auto-cols-fr gap-xxs rounded-pill border border-hairline p-xxs'
  return 'flex gap-xs'
})

function isSelected(value: T) {
  return model.value === value
}

function optionClass(value: T) {
  if (track.value) return isSelected(value) ? 'bg-ink text-canvas' : 'text-body hover:text-ink'
  return isSelected(value) ? 'bg-ink px-md text-canvas' : 'bg-surface-elevated px-md text-body hover:text-ink'
}

function hintClass(value: T) {
  return isSelected(value) ? 'text-canvas/70' : 'text-muted'
}

function select(value: T) {
  model.value = value
}
</script>

<template>
  <div :role="track ? 'tablist' : 'group'" :aria-label="label" :class="groupClass">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :role="track ? 'tab' : undefined"
      :aria-selected="track ? isSelected(option.value) : undefined"
      :aria-pressed="track ? undefined : isSelected(option.value)"
      class="h-9 rounded-pill text-label font-semibold transition-colors"
      :class="optionClass(option.value)"
      @click="select(option.value)"
    >
      {{ option.label }}
      <span v-if="option.hint" class="ml-xxs text-support font-medium tabular-nums" :class="hintClass(option.value)">{{ option.hint }}</span>
    </button>
  </div>
</template>
