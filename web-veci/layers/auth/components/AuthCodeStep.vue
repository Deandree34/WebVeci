<script setup lang="ts">
import type { OtpChannel, OtpSent } from '~/api/types'
import { useSendCode, useVerifyCode } from '../queries'

/**
 * Paso 2 del acceso: el código de 6 dígitos. Se verifica solo al completar las 6 cifras (el teléfono
 * puede rellenarlo con `one-time-code`). Para reenviar hay que esperar; luego se puede pedir otra vez
 * por WhatsApp o por SMS. Tras 5 intentos o 5 minutos, hay que pedir un código nuevo.
 */
interface AuthCodeStepProps {
  phone: string
  sent: OtpSent
}

interface AuthCodeStepEmits {
  verified: [isNew: boolean]
  back: []
}

const CHANNEL_NAMES: Record<OtpChannel, string> = {
  whatsapp: 'WhatsApp',
  sms: 'SMS'
}

const props = defineProps<AuthCodeStepProps>()
const emit = defineEmits<AuthCodeStepEmits>()

const channel = ref<OtpChannel>(props.sent.channel)
const prettyPhone = computed(() => `+52 ${props.phone.slice(0, 3)} ${props.phone.slice(3, 6)} ${props.phone.slice(6)}`)
const sentText = computed(() => `Lo mandamos por ${CHANNEL_NAMES[channel.value]} al ${prettyPhone.value}.`)

/** Solo en desarrollo: el código del mock (`DEMO_CODE` en `server/mock/auth.ts`), para probar sin backend. */
const demoHint = import.meta.dev ? 'Prueba: usa el código 123456' : undefined

const code = ref('')
const error = ref<string>()
/** Mensaje para lectores de pantalla al reenviar. */
const status = ref('')

/* ---------- Reenviar: cuenta regresiva ---------- */
const secondsLeft = ref(props.sent.resendIn)
let timer: ReturnType<typeof setInterval> | undefined

function startCountdown(seconds: number) {
  secondsLeft.value = seconds
  clearInterval(timer)
  timer = setInterval(() => {
    secondsLeft.value -= 1
    if (secondsLeft.value <= 0) clearInterval(timer)
  }, 1000)
}

onMounted(() => startCountdown(props.sent.resendIn))
onBeforeUnmount(() => clearInterval(timer))

const countdownText = computed(() => `Reenviar en 0:${String(secondsLeft.value).padStart(2, '0')}`)

const sendCode = useSendCode()

function resend(next: OtpChannel) {
  sendCode.mutate({ phone: props.phone, channel: next }, {
    onSuccess: (sent) => {
      channel.value = sent.channel
      code.value = ''
      error.value = undefined
      status.value = `Te mandamos un código nuevo por ${CHANNEL_NAMES[sent.channel]}.`
      startCountdown(sent.resendIn)
      field.value?.focus()
    },
    onError: () => {
      error.value = 'No pudimos mandar el código. Intenta de nuevo.'
    }
  })
}

/* ---------- Verificar ---------- */
const verifyCode = useVerifyCode()

function submit() {
  if (code.value.length !== 6) {
    error.value = 'Escribe las 6 cifras del código.'
    return
  }
  verifyCode.mutate({ phone: props.phone, code: code.value }, {
    onSuccess: (result) => emit('verified', result.isNew),
    onError: (failure) => {
      if (failure.code === 'otp_invalid') {
        const attemptsLeft = Number(failure.details?.attemptsLeft)
        const plural = attemptsLeft === 1 ? 'intento' : 'intentos'
        error.value = `Código incorrecto. Te quedan ${attemptsLeft} ${plural}.`
      }
      else if (failure.code === 'otp_expired') error.value = 'El código venció. Pide uno nuevo.'
      else if (failure.code === 'otp_locked') error.value = 'Demasiados intentos. Pide un código nuevo.'
      else {
        error.value = 'No pudimos revisar el código. Intenta de nuevo.'
        return
      }
      code.value = ''
      field.value?.focus()
    }
  })
}

// Solo cifras; al completar las 6 se verifica sin tocar el botón
watch(code, (value) => {
  const clean = value.replace(/\D/g, '').slice(0, 6)
  if (clean !== value) {
    code.value = clean
    return
  }
  if (clean.length > 0) error.value = undefined
  if (clean.length === 6 && !verifyCode.isPending.value) submit()
})

const field = ref<{ focus: () => void }>()
onMounted(() => field.value?.focus())
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <p class="mb-lg text-copy text-body">
      {{ sentText }}
      <button type="button" class="font-semibold text-ink underline-offset-2 hover:underline" @click="emit('back')">Cambiar</button>
    </p>

    <AuthField
      ref="field"
      v-model="code"
      label="Código de 6 dígitos"
      code
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      placeholder="······"
      maxlength="6"
      :error="error"
      :hint="demoHint"
    />

    <div class="mt-xl">
      <AuthSubmit :loading="verifyCode.isPending.value">Entrar</AuthSubmit>
    </div>

    <div class="mt-lg flex flex-wrap items-center gap-x-md gap-y-xs text-support font-semibold">
      <span v-if="secondsLeft > 0" class="font-medium text-muted tabular-nums">{{ countdownText }}</span>
      <template v-else>
        <button type="button" class="text-body transition-colors hover:text-ink disabled:opacity-40" :disabled="sendCode.isPending.value" @click="resend('whatsapp')">
          Reenviar por WhatsApp
        </button>
        <button type="button" class="text-body transition-colors hover:text-ink disabled:opacity-40" :disabled="sendCode.isPending.value" @click="resend('sms')">
          Mandar por SMS
        </button>
      </template>
    </div>

    <p class="sr-only" aria-live="polite">{{ status }}</p>
  </form>
</template>
