/**
 * Feed de la colonia: publicaciones tipadas de los negocios + las de VECI.
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend.
 * El orden por relevancia (`score`) simula lo que calculará el backend.
 */

import type { Business, FeedItem, PostPhoto } from '../types'
import { availabilitySummary, colonyHour, promoWindow, scheduleStatus } from '../../utils/hours'
import { findBusiness } from './businesses'

const MINUTE = 60_000

/** Publicación base: `ago` en minutos respecto a "ahora". */
interface Seed {
  id: string
  type: FeedItem['type']
  businessId: string
  ago: number
  tab?: FeedItem['tab']
  /** Solo en `publicacion`: lo que escribió el negocio y sus fotos. */
  post?: { text: string, photos: PostPhoto[] }
}

// `horarios` = aviso de citas disponibles: el post no guarda horas (se ocupan a cada rato);
// franja y nivel se calculan al momento y las horas exactas se ven al apartar en el negocio.
const seeds: Seed[] = [
  { id: 'f1', type: 'oferta', businessId: 'guero', ago: 60, tab: 'ofertas' },
  { id: 'f2', type: 'horarios', businessId: 'bellaluz', ago: 120, tab: 'citas' },
  { id: 'f3', type: 'horarios', businessId: 'guero', ago: 25, tab: 'citas' },
  { id: 'f4', type: 'oferta', businessId: 'bellaluz', ago: 240, tab: 'ofertas' },
  // Publicaciones normales: solo en "Para ti" (sin pestaña)
  {
    id: 'p1',
    type: 'publicacion',
    businessId: 'guero',
    ago: 120,
    post: {
      text: 'Estrenamos local en Calle Hidalgo 56: más sillones, más luz y menos espera.\n\nEste sábado los esperamos con café de olla para todos los que vengan a cortarse. Gracias, vecinos, por estos años con nosotros.',
      photos: [
        { src: '/posts/barberia4.jpg', alt: 'Barbero afeitando a un cliente en el nuevo local, con espejo y repisas de madera' },
        { src: '/posts/barberia3.jpg', alt: 'Barbero perfilando la ceja de un cliente junto a la fila de sillones' },
        { src: '/posts/barberia2.jpg', alt: 'Corte con máquina en la nuca de un cliente de cabello rizado' },
        // Foto de prueba con una marca ajena visible: va 4.ª para quedar tras el "+1"; reemplazar por una propia
        { src: '/posts/barberia1.jpg', alt: 'Barbero aplicando mascarilla negra en el rostro de un cliente' }
      ]
    }
  },
  {
    id: 'p2',
    type: 'publicacion',
    businessId: 'bellaluz',
    ago: 300,
    post: {
      text: 'Ya está listo nuestro nuevo espacio de pedicure, con sillones reclinables y tinas de piedra. ¡Pasen a conocerlo!',
      photos: [{ src: '/posts/estetica2.jpg', alt: 'Área de pedicure con muro de flores y letrero de neón' }]
    }
  }
]

/** Publicaciones de VECI en posiciones fijas del feed. */
const veciSeeds: (Seed & { at: number })[] = [
  { id: 'v1', type: 'resena', businessId: 'guero', ago: 60 * 24 * 2, at: 2 }
]

/** Relevancia: lo abierto y los horarios libres suben; las ofertas vencidas bajan. */
function score(item: FeedItem, now: number): number {
  const hour = colonyHour(now)
  let total = 0
  if (scheduleStatus(item.business, now).open) total += 20
  if (item.type === 'horarios' && item.business.availability) {
    // Sin lugar ni hoy ni mañana baja, igual que una oferta vencida
    total += availabilitySummary(item.business.availability, hour).level === 'full' ? -40 : 10
  }
  if (item.type === 'oferta' && item.business.promo) {
    total += promoWindow(item.business.promo, now).endsAt > now ? 15 : -40
  }
  // Las novedades se mezclan con ofertas y citas sin taparlas
  if (item.type === 'publicacion') total += 5
  return total
}

function toItem(seed: Seed, now: number): FeedItem {
  const business: Business = findBusiness(seed.businessId)!
  const base = { id: seed.id, tab: seed.tab, business, publishedAt: new Date(now - seed.ago * MINUTE).toISOString() }
  if (seed.type === 'publicacion') return { ...base, type: 'publicacion', text: seed.post?.text ?? '', photos: seed.post?.photos ?? [] }
  return { ...base, type: seed.type }
}

/** Feed completo ordenado para el instante `now`. */
export function makeMockFeed(now: number): FeedItem[] {
  const items = seeds.map((seed) => toItem(seed, now)).sort((a, z) => score(z, now) - score(a, now))
  for (const seed of veciSeeds) items.splice(Math.min(seed.at, items.length), 0, toItem(seed, now))
  return items
}
