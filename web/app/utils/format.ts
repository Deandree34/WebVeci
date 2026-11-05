/** Utilidades de formato (auto-importadas por Nuxt). */

/** Fecha ISO → texto corto, p. ej. "17 oct". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

/** Monto en MXN sin decimales, p. ej. "$1,250". */
export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString('es-MX')}`
}

/** Distancia en metros → "400 m" o "1.2 km". */
export function formatDistance(meters: number): string {
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1).replace(/\.0$/, '')} km`
}

/**
 * Nombre corto del negocio para espacios chicos (historias): quita el giro del inicio si
 * coincide, p. ej. "Barbería El Güero" → "El Güero". Si no coincide, el nombre completo.
 */
export function shortName(business: { name: string, subcategory: string }): string {
  const prefix = `${business.subcategory} `
  return business.name.toLowerCase().startsWith(prefix.toLowerCase()) && business.name.length > prefix.length
    ? business.name.slice(prefix.length)
    : business.name
}

/** Milisegundos restantes → "05:42:10" o, si pasa de un día, "2 d 04 h". */
export function formatCountdown(ms: number): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const total = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(total / 86_400)
  const hours = Math.floor((total % 86_400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  return days ? `${days} d ${pad(hours)} h` : `${pad(hours)}:${pad(minutes)}:${pad(total % 60)}`
}

/**
 * Fecha ISO → tiempo relativo, p. ej. "hace 3 h"; pasada una semana, fecha corta.
 * Depende de la hora actual: usar solo en contenido renderizado en cliente.
 */
export function formatRelativeTime(iso: string, now = Date.now()): string {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000)
  if (minutes < 1) return 'ahora'

  const rtf = new Intl.RelativeTimeFormat('es-MX', { numeric: 'auto', style: 'short' })
  if (minutes < 60) return rtf.format(-minutes, 'minute')
  if (minutes < 60 * 24) return rtf.format(-Math.round(minutes / 60), 'hour')
  if (minutes < 60 * 24 * 7) return rtf.format(-Math.round(minutes / (60 * 24)), 'day')
  return formatDate(iso)
}

/**
 * Fecha ISO → antigüedad compacta, p. ej. "12 min", "1 h", "3 d"; pasada una semana, fecha corta.
 * Para cabeceras de post, donde "hace" sobra. Mismas reglas que `formatRelativeTime`.
 */
export function formatAge(iso: string, now = Date.now()): string {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000)
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `${minutes} min`
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} h`
  if (minutes < 60 * 24 * 7) return `${Math.round(minutes / (60 * 24))} d`
  return formatDate(iso)
}

/** Minutos → "45 min", "1 h" o "1 h 30 min". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

/** Enlace de "Cómo llegar" en Google Maps a partir de la dirección. */
export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/** Enlace a un chat de WhatsApp (número mexicano a 10 dígitos) con mensaje inicial. */
export function whatsappUrl(number: string, text?: string): string {
  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/52${number.replace(/\D/g, '')}${query}`
}
