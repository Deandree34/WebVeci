<script setup lang="ts">
import type { OtpSent } from '~/api/types'
import { useSendCode } from '../queries'

/**
 * Paso 1 del acceso: el celular (10 dígitos, +52 fijo). Al enviarlo se manda el código por WhatsApp.
 * Entrar y crear cuenta empiezan igual: aquí no se pregunta si el vecino ya tiene cuenta.
 */
interface AuthPhoneStepProps {
  /** Número ya escrito (al volver con "Cambiar número"). */
  initialPhone?: string
}

interface AuthPhoneStepEmits {
  sent: [phone: string, sent: OtpSent]
}

const props = defineProps<AuthPhoneStepProps>()
const emit = defineEmits<AuthPhoneStepEmits>()

/** "9991234567" -> "999 123 4567" mientras se escribe. */
function formatPhone(digits: string) {
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)]
  return parts.filter((part) => part.length > 0).join(' ')
}

const display = ref(formatPhone(props.initialPhone ?? ''))
const digits = computed(() => display.value.replace(/\D/g, '').slice(0, 10))
const touched = ref(false)

watch(display, (value) => {
  const formatted = formatPhone(value.replace(/\D/g, '').slice(0, 10))
  if (formatted !== value) display.value = formatted
})

const sendCode = useSendCode()

const error = computed(() => {
  if (sendCode.isError.value) return 'No pudimos mandar el código. Intenta de nuevo.'
  if (touched.value && digits.value.length !== 10) return 'Escribe los 10 dígitos de tu celular.'
  return undefined
})

function submit() {
  touched.value = true
  if (digits.value.length !== 10) return
  const phone = digits.value
  sendCode.mutate({ phone, channel: 'whatsapp' }, {
    onSuccess: (sent) => emit('sent', phone, sent)
  })
}

const field = ref<{ focus: () => void }>()
onMounted(() => field.value?.focus())
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <AuthField
      ref="field"
      v-model="display"
      label="Tu celular"
      prefix="+52"
      type="tel"
      inputmode="numeric"
      autocomplete="tel-national"
      placeholder="999 123 4567"
      maxlength="12"
      :error="error"
      hint="Te mandamos un código por WhatsApp. Sin contraseñas."
    />

    <div class="mt-xl">
      <AuthSubmit :loading="sendCode.isPending.value">Enviar código</AuthSubmit>
    </div>

    <p class="mt-md text-meta text-muted-soft">
      Al continuar aceptas los Términos y el Aviso de privacidad de VECI. Tu número no se muestra a nadie.
    </p>
  </form>
</template>
