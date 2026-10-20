/**
 * Negocios de la colonia (datos tomados del prototipo `veci-feed.html`).
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend.
 * Etapa 1: solo la categoría `belleza` (ver `docs/business-model.md` §6).
 */

import type { Business, BusinessSummary } from '../types'

export const businesses: Business[] = [
  {
    id: 'guero',
    slug: 'barberia-el-guero',
    name: 'Barbería El Güero',
    categoryId: 'belleza',
    subcategory: 'Barbería',
    icon: 'material-symbols:content-cut',
    verified: true,
    capabilities: ['citas'],
    rating: 4.9,
    recommendations: 52,
    recommendedBy: [
      { name: 'Ana', street: 'Calle Hidalgo' },
      { name: 'Carlos', street: 'Av. Juárez' },
      { name: 'Lupe', street: 'Calle Morelos' },
      { name: 'Jorge', street: 'Av. Juárez' },
      { name: 'Rosa', street: 'Calle Allende' },
      { name: 'Miguel', street: 'Calle Reforma' }
    ],
    distanceMeters: 400,
    walkMinutes: 5,
    address: 'Calle Hidalgo 56',
    description: 'Cortes clásicos y modernos, barba',
    hours: [[10, 21]],
    // Domingo medio día y lunes de descanso
    weekHours: [[[10, 15]], [], [[10, 21]], [[10, 21]], [[10, 21]], [[10, 21]], [[9, 21]]],
    payments: ['efectivo', 'transferencia'],
    contact: { whatsapp: '5512345678' },
    services: [
      { name: 'Corte', price: 120, durationMinutes: 30, note: 'Clásico o moderno, con lavado' },
      { name: 'Corte + barba', price: 180, durationMinutes: 50 },
      { name: 'Arreglo de barba', price: 80, durationMinutes: 20, note: 'Toalla caliente y navaja' }
    ],
    availability: {
      today: ['17:30', '18:15', '19:45'],
      tomorrow: ['10:00', '11:30', '13:00', '16:30']
    },
    promo: {
      text: 'Corte + barba $150',
      note: 'Antes $180',
      remaining: 'Quedan 4 lugares',
      until: 'today',
      endsAtHour: 21
    },
    reviews: [
      {
        text: 'Llevo tres años cortándome aquí. Puntual, buen precio y te ofrecen café mientras esperas.',
        author: 'Jorge',
        street: 'Av. Juárez',
        rating: 5
      },
      {
        text: 'Le llevé a mi hijo por primera vez y tuvo toda la paciencia del mundo. Quedó feliz con su corte.',
        author: 'Ana',
        street: 'Calle Hidalgo',
        rating: 5
      },
      {
        text: 'El arreglo de barba quedó perfecto. A veces hay que esperar un poco, mejor aparta tu lugar.',
        author: 'Carlos',
        street: 'Av. Juárez',
        rating: 4
      },
      {
        text: 'Muy limpio y atienden a tiempo. Ya es la barbería de mi esposo y de mis dos hijos.',
        author: 'Rosa',
        street: 'Calle Allende',
        rating: 5
      }
    ]
  },
  {
    id: 'bellaluz',
    slug: 'estetica-bella-luz',
    name: 'Estética Bella Luz',
    categoryId: 'belleza',
    subcategory: 'Estética',
    icon: 'material-symbols:spa',
    verified: true,
    capabilities: ['citas'],
    rating: 4.8,
    recommendations: 38,
    recommendedBy: [
      { name: 'Mariana', street: 'Calle Morelos' },
      { name: 'Rosa', street: 'Calle Allende' },
      { name: 'Paty', street: 'Calle Hidalgo' },
      { name: 'Sofía', street: 'Calle Reforma' },
      { name: 'Elena', street: 'Av. Juárez' },
      { name: 'Luis', street: 'Calle Hidalgo' }
    ],
    distanceMeters: 700,
    walkMinutes: 9,
    address: 'Av. Juárez 120',
    description: 'Uñas, tinte, peinados y pestañas',
    hours: [[10, 20]],
    // Domingo cerrado; sábado corrido desde temprano
    weekHours: [[], [[10, 20]], [[10, 20]], [[10, 20]], [[10, 20]], [[10, 20]], [[9, 18]]],
    payments: ['efectivo', 'tarjeta', 'transferencia'],
    contact: { whatsapp: '5587654321', phone: '5587654321' },
    services: [
      { name: 'Manicure', price: 180, durationMinutes: 45 },
      { name: 'Pedicure', price: 220, durationMinutes: 60 },
      { name: 'Tinte', price: 450, fromPrice: true, durationMinutes: 120, note: 'Según el largo del cabello' },
      { name: 'Peinado', price: 300, durationMinutes: 60 }
    ],
    availability: {
      today: ['18:00'],
      tomorrow: ['10:30', '12:00', '15:00', '17:30']
    },
    promo: {
      text: '20% en manicure',
      note: 'Martes y miércoles',
      remaining: 'Apartando cita',
      until: 'week'
    },
    reviews: [
      {
        text: 'Mariana me hizo las uñas para la boda de mi hermana y duraron perfectas toda la semana.',
        author: 'Mariana',
        street: 'Calle Morelos',
        rating: 5
      },
      {
        text: 'Buen tinte y buen precio. Me explicaron cómo cuidarlo para que no se deslave.',
        author: 'Paty',
        street: 'Calle Hidalgo',
        rating: 4
      }
    ]
  }
]

export function findBusiness(idOrSlug: string): Business | undefined {
  return businesses.find((business) => business.id === idOrSlug || business.slug === idOrSlug)
}

export function toSummary(business: Business): BusinessSummary {
  const { id, slug, name, categoryId, subcategory, icon, verified } = business
  return { id, slug, name, categoryId, subcategory, icon, verified }
}
