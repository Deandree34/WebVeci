/**
 * Endpoints de acceso: celular + código de 6 dígitos, sin contraseña.
 *
 * Con el backend real estas llamadas van al BFF (`server/`), que habla con FastAPI y guarda la
 * sesión en una cookie httpOnly + Secure + SameSite; el navegador nunca ve el token.
 *
 * El backend limita envíos por número e IP, guarda el código hasheado y responde igual exista o no
 * la cuenta (nadie puede averiguar qué números están registrados).
 */

import { api } from '~/api/client'
import type { NewProfile, OtpChannel, OtpSent, OtpVerification, Person } from '~/api/types'

export const authApi = {
  /** Manda el código al celular (10 dígitos, sin +52). */
  sendCode: (phone: string, channel: OtpChannel) =>
    api<OtpSent>('/auth/otp', { method: 'POST', body: { phone, channel } }),

  /**
   * Verifica el código; con un número nuevo, `isNew` pide completar el perfil.
   * Si no sirve lanza `ApiError`: `otp_invalid` (`details.attemptsLeft`), `otp_expired` u `otp_locked`.
   */
  verifyCode: (phone: string, code: string) =>
    api<OtpVerification>('/auth/otp/verify', { method: 'POST', body: { phone, code } }),

  /** Completa el perfil de una cuenta nueva. */
  completeProfile: (profile: NewProfile) => api<Person>('/me', { method: 'PATCH', body: profile })
}
