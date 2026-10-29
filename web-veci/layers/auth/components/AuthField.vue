<script setup lang="ts">
/**
 * Campo de la pantalla de acceso: etiqueta, texto grande sobre una línea y un brillo ocre que la
 * recorre al enfocar (el campo además se corre un poco a la derecha).
 * Texto de interfaz fijo (≥ 16px: iOS no hace zoom al enfocar); `code` usa cifras en Plus Jakarta,
 * fluidas y espaciadas (código de 6 dígitos), como las demás cifras de la app.
 * `prefix` va fijo antes del texto ("+52").
 * Los demás atributos (`type`, `inputmode`, `autocomplete`, `maxlength`…) pasan directo al `<input>`.
 */
interface AuthFieldProps {
  label: string
  error?: string
  hint?: string
  prefix?: string
  code?: boolean
}

defineOptions({ inheritAttrs: false })

const props = defineProps<AuthFieldProps>()
const model = defineModel<string>({ default: '' })

const id = useId()
const errorId = `${id}-error`
const hintId = `${id}-hint`

const describedBy = computed(() => {
  if (props.error) return errorId
  if (props.hint) return hintId
  return undefined
})

const inputClass = computed(() => {
  if (props.code) return 'font-headline text-figure font-bold tracking-[0.5em] tabular-nums'
  return 'text-section'
})

const input = ref<HTMLInputElement>()

function focus() {
  input.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="group transition-transform duration-[400ms] ease-[cubic-bezier(0.2,1,0.3,1)] focus-within:translate-x-[10px] motion-reduce:transition-none motion-reduce:focus-within:translate-x-0">
    <label :for="id" class="mb-xs block text-label font-semibold text-body">{{ label }}</label>

    <div class="relative flex items-baseline gap-xs border-b border-hairline-strong">
      <span v-if="prefix" class="text-section text-muted tabular-nums">{{ prefix }}</span>
      <input
        :id="id"
        ref="input"
        v-model="model"
        v-bind="$attrs"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        class="w-full min-w-0 bg-transparent py-sm text-ink placeholder:text-muted-soft focus-visible:outline-none"
        :class="inputClass"
      >
      <span
        class="absolute -bottom-px left-0 h-0.5 w-0 bg-brand shadow-[0_0_15px_var(--color-brand)] transition-[width] duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)] group-focus-within:w-full motion-reduce:transition-none"
        aria-hidden="true"
      />
    </div>

    <p v-if="error" :id="errorId" class="mt-xs flex items-center gap-xxs text-support text-body-strong" role="alert">
      <Icon name="material-symbols:error-outline" size="16" class="shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="mt-xs text-support text-muted">{{ hint }}</p>
  </div>
</template>
