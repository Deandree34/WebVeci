/**
 * Simulación del acceso por código (OTP), usada por `server/api/v1/auth/`.
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend. Imita sus reglas para probar la UI:
 *  - el código vale 5 minutos y se puede intentar 5 veces; después hay que pedir otro;
 *  - entre envíos hay que esperar 30 segundos;
 *  - el código de prueba siempre es `123456`;
 *  - `999 123 4567` es una cuenta existente (Alejandro); cualquier otro número es nuevo.
 */

import { apiError } from '../utils/mock-api'
import { currentUser } from './people'
import type { OtpChannel, OtpSent, OtpVerification } from '../../app/api/types'

export const DEMO_CODE = '123456'
export const DEMO_PHONE = '9991234567'

const CODE_TTL_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5
const RESEND_SECONDS = 30

interface PendingCode {
  expiresAt: number
  attemptsLeft: number
}

const pending = new Map<string, PendingCode>()

export function mockSendCode(phone: string, channel: OtpChannel): OtpSent {
  pending.set(phone, { expiresAt: Date.now() + CODE_TTL_MS, attemptsLeft: MAX_ATTEMPTS })
  return { channel, resendIn: RESEND_SECONDS }
}

/** Verifica el código; si no sirve, responde el error del contrato (`otp_invalid` / `otp_expired` / `otp_locked`). */
export function mockVerifyCode(phone: string, code: string): OtpVerification {
  const entry = pending.get(phone)
  if (!entry || Date.now() > entry.expiresAt) {
    pending.delete(phone)
    apiError(400, 'otp_expired', 'El código venció')
  }
  if (code !== DEMO_CODE) {
    entry.attemptsLeft -= 1
    if (entry.attemptsLeft <= 0) {
      pending.delete(phone)
      apiError(429, 'otp_locked', 'Demasiados intentos')
    }
    apiError(400, 'otp_invalid', 'Código incorrecto', { attemptsLeft: entry.attemptsLeft })
  }
  pending.delete(phone)
  if (phone === DEMO_PHONE) return { isNew: false, user: currentUser }
  return { isNew: true }
}
