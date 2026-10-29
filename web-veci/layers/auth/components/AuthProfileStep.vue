<script setup lang="ts">
import { useCompleteProfile } from '../queries'

/**
 * Paso 3, solo para cuentas nuevas: nombre y colonia. Es todo lo que se pide para crear la cuenta;
 * la foto y la calle se agregan después desde "Editar perfil".
 */
interface AuthProfileStepEmits {
  done: []
}

const emit = defineEmits<AuthProfileStepEmits>()

const name = ref('')
const colony = ref('')
const touched = ref(false)

const nameError = computed(() => {
  if (touched.value && name.value.trim().length < 2) return 'Escribe tu nombre.'
  return undefined
})

const colonyError = computed(() => {
  if (touched.value && colony.value.trim().length < 3) return 'Escribe tu colonia.'
  return undefined
})

const completeProfile = useCompleteProfile()

const submitError = computed(() => {
  if (completeProfile.isError.value) return 'No pudimos crear tu cuenta. Intenta de nuevo.'
  return undefined
})

function submit() {
  touched.value = true
  if (nameError.value || colonyError.value) return
  completeProfile.mutate({ name: name.value.trim(), colony: colony.value.trim() }, {
    onSuccess: () => emit('done')
  })
}

const field = ref<{ focus: () => void }>()
onMounted(() => field.value?.focus())
</script>

<template>
  <form novalidate class="flex flex-col gap-lg" @submit.prevent="submit">
    <AuthField
      ref="field"
      v-model="name"
      label="Tu nombre"
      autocomplete="name"
      placeholder="Como te conocen los vecinos"
      maxlength="40"
      :error="nameError"
    />

    <AuthField
      v-model="colony"
      label="Tu colonia"
      autocomplete="address-level3"
      placeholder="Col. Centro"
      maxlength="60"
      :error="colonyError ?? submitError"
      hint="Verás los negocios y avisos de tu colonia."
    />

    <div class="mt-md">
      <AuthSubmit :loading="completeProfile.isPending.value">Crear mi cuenta</AuthSubmit>
    </div>
  </form>
</template>
