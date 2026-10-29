# Modelo de negocio — VECI

> Documento vivo. Describe **qué es VECI y qué información maneja**. La arquitectura técnica
> está en [architecture.md](architecture.md). Fuente original: el prototipo `veci-feed.html`
> (del que se toma solo el modelo y los datos; el estilo es el del design system del proyecto).

---

## 1. Qué es VECI

Una red **hiperlocal de la colonia**. Los **negocios** de la colonia publican información útil y
con acción (ofertas, horarios libres, menús, avisos), y los **vecinos** actúan sobre ella:
apartan una cita, hacen un pedido, piden una cotización o piden ayuda.

**Reglas del producto**

- El negocio publica, el vecino **actúa**. No hay comentarios, composer de vecinos, amigos ni
  seguidores. La única reacción es el **apretón de manos**: en el post y el
  perfil **recomienda al negocio**; en las fotos de una publicación (vista del post) cada foto lleva
  su propio contador, como un "me gusta" de esa foto.
- La confianza se construye con **recomendaciones de vecinos** ("41 vecinos lo recomiendan"),
  calificación tras un servicio real y negocios **verificados**.
- Todo es **de hoy y de cerca**: estado abierto/cerrado, distancia, horarios libres, ofertas con
  fecha de término.
- Privacidad: el vecino no expone su número; el contacto es solo para una solicitud.
- El pago se hace **directo en el negocio** (VECI no cobra en esta etapa).

---

## 2. Taxonomía: categoría + capacidades

Dos ejes independientes:

- **Categoría (giro):** qué *es* el negocio. Organiza navegación, filtros e identidad.
- **Capacidades:** qué se *puede hacer* con él. Determina sus flujos y tipos de publicación.

Una categoría define capacidades **por defecto**; cada negocio puede tener varias.

### 2.1 Categorías

| Categoría | `slug` | Icono (Material Symbols) | Subcategorías (ejemplos) | Capacidades por defecto |
|---|---|---|---|---|
| Belleza y cuidado personal | `belleza` | `content-cut` | Barbería, estética, uñas, spa, maquillaje | citas |
| Salud | `salud` | `medical-services` | Medicina general, odontología, farmacia, psicología, laboratorio | citas, informativo |
| Comida y bebida | `comida` | `restaurant` | Taquería, pizzería, cafetería, panadería, comida corrida | pedidos |
| Ocio y vida nocturna | `ocio` | `nightlife` | Bar, karaoke, billar, cine | informativo |
| Hogar y reparaciones | `hogar` | `home-repair-service` | Plomería, electricidad, cerrajería, limpieza, pintura | solicitud |
| Transporte y envíos | `transporte` | `local-shipping` | Taxi de sitio, fletes y mudanzas, mandados | cotizacion |
| Deportes y bienestar | `deportes` | `fitness-center` | Gimnasio, clases (yoga, box, baile), canchas | citas |
| Educación | `educacion` | `school` | Regularización, idiomas, música, guardería | citas |
| Mascotas | `mascotas` | `pets` | Veterinaria, estética canina, alimento | citas, pedidos |
| Tiendas | `tiendas` | `storefront` | Abarrotes, papelería, ferretería, ropa | pedidos, informativo |
| Servicios profesionales | `profesionales` | `work` | Contabilidad, legal, impresión, reparación de celulares | cotizacion |
| Comunidad | `comunidad` | `groups` | Avisos, eventos, tianguis, fondo vecinal | — |

**Comunidad** no agrupa negocios: es el contenido de la colonia que publica *VECI* (avisos,
eventos, votaciones del fondo vecinal, "abierto ahora", reseñas destacadas).

### 2.2 Capacidades

| Capacidad | `id` | Datos que requiere | Flujo del vecino |
|---|---|---|---|
| Citas | `citas` | servicios con precio, horarios libres (hoy / mañana) | elegir horario → servicio → nombre → cita en *Mis cosas* |
| Pedidos | `pedidos` | menú/catálogo con precio | menú → carrito → pedido para recoger |
| Cotización | `cotizacion` | descripción del servicio | de dónde / a dónde / cuándo → el negocio responde precio |
| Solicitud de ayuda | `solicitud` | disponibilidad | describir problema → vecinos que pueden ayudar → contacto verificado |
| Informativo | `informativo` | horario, ubicación | ver detalle y cómo llegar |

---

## 3. Entidades

| Entidad | Campos principales | Notas |
|---|---|---|
| `Category` | `id`, `slug`, `label`, `icon`, `subcategories[]`, `capabilities[]`, `available` | `available` = ya habilitada en el producto |
| `Business` | `id`, `slug`, `name`, `categoryId`, `subcategory`, `icon`, `capabilities[]`, `rating`, `recommendations`, `distance`, `walkMinutes`, `address`, `description`, `hours[]`, `verified` | `hours`: rangos `[abre, cierra]` en horas; `>24` = madrugada del día siguiente |
| `Service` | `name`, `price` | capacidad *citas* |
| `Availability` | `today[]`, `tomorrow[]` (`"HH:MM"`) | horarios libres; los de hoy que ya pasaron no se muestran |
| `Promo` | `text`, `note`, `remaining`, `until` (`today` / `week`), `endsAtHour?` | oferta con cuenta regresiva |
| `Review` | `text`, `author`, `street` | reseña destacada de un vecino |
| `FeedItem` | `id`, `type`, `businessId?`, `publishedAt`, `tab` + datos según `type` | ver §4 |
| `Story` | `id`, `businessId`, `kind`, `headline`, `text`, `action` | dura 24 h |
| `Booking` | `id`, `businessId`, `service`, `day`, `time`, `customerName`, `createdAt` | cita apartada (capacidad *citas*) |
| `Notice` | `id`, `date`, `title`, `detail` | categoría *Comunidad* |
| `NeighborhoodFund` | `amount`, `question`, `votes` | categoría *Comunidad* |

---

## 4. Tipos de publicación (`FeedItem.type`)

| Tipo | Autor | Capacidad / categoría | Contenido | Acción |
|---|---|---|---|---|
| `oferta` | negocio | cualquiera con `promo` | promo, nota, cuenta regresiva, lugares restantes | Aprovechar |
| `horarios` | negocio | citas | "Todavía tengo lugar hoy", horarios libres | elegir horario → apartar |
| `resena` | VECI | cualquiera | reseña destacada de un vecino | Conocer al negocio |
| `novedad` | negocio | pedidos | texto + producto destacado con precio | Ver menú |
| `menu` | negocio | pedidos | menú del día | Pedir para recoger |
| `nuevo` | negocio | cualquiera | "Nuevo en la colonia" | Ver detalles |
| `ahora` | VECI | informativo | qué está abierto ahora (línea del día) | Ver el día completo |
| `colonia` | VECI | comunidad | mapa con actividad en vivo y estadísticas | Ver mapa |
| `aviso` | VECI | comunidad | aviso con fecha | Recordármelo |

**Orden del feed** (lo decide el backend; hoy lo simula el mock): sube lo de la franja horaria
actual, lo abierto ahora, las ofertas vigentes y los horarios libres; bajan las ofertas vencidas.

**Pestañas del feed:** *Para ti* (todo) y una por tipo relevante (*Ofertas*, *Citas*; luego
*Comer*, *Avisos*…).

---

## 5. Secciones de la app

| Sección | Ruta | Contenido |
|---|---|---|
| Inicio | `/` | saludo, historias, pestañas, feed |
| Categoría | `/categoria/[slug]` | negocios de la categoría, filtro *Abierto ahora* |
| Negocio | `/negocio/[slug]` | detalle, servicios/menú, horarios libres, reseña, acción principal |
| Mis cosas | `/mis-cosas` | citas, pedidos y solicitudes del vecino |
| Guardados | `/guardados` | negocios de confianza (solo los ve el vecino) |
| Hoy en la colonia | `/hoy` | línea del día, mapa, actividad (llega con *Ocio* / *Comunidad*) |

Columna derecha: *Abierto ahora*; con *Comunidad*: *Fondo vecinal* y *Próximos avisos*.

---

## 6. Negocios del prototipo

| Negocio | Categoría | Subcategoría | Capacidades | Etapa |
|---|---|---|---|---|
| Barbería El Güero | belleza | Barbería | citas | **1** |
| Estética Bella Luz | belleza | Estética | citas | **1** |
| Dra. Paola Méndez | salud | Odontología | citas | 2 |
| Dr. Jorge Ramírez | salud | Medicina general | citas | 2 |
| Farmacia del Parque | salud | Farmacia | informativo | 2 |
| Tacos Don Beto | comida | Taquería | pedidos | 3 |
| Pizzería Nonna | comida | Pizzería | pedidos | 3 |
| Café La Banca | comida | Cafetería | pedidos | 3 |
| Panadería Lupita | comida | Panadería | pedidos | 3 |
| Cocina Doña Mary | comida | Comida corrida | pedidos | 3 |
| Don Luis | hogar | Plomería | solicitud | 4 |
| Mariana R. | hogar | Electricidad | solicitud | 4 |
| Cerrajería Soto | hogar | Cerrajería | solicitud, informativo | 4 |
| Teresa G. | hogar | Limpieza | solicitud | 4 |
| Sitio de Taxis Centro | transporte | Taxi de sitio | cotizacion | 5 |
| Fletes Hernández | transporte | Fletes y mudanzas | cotizacion | 5 |
| Mandados Rosy | transporte | Mandados | cotizacion | 5 |
| La Esquina | ocio | Bar | informativo | 6 |

---

## 7. Hoja de ruta por categoría

Se avanza **una categoría a la vez**; cada etapa agrega datos, sus tipos de publicación y su
capacidad si es nueva, reutilizando la base común.

| Etapa | Categoría | Nuevo en esta etapa |
|---|---|---|
| **1** | Belleza (El Güero, Bella Luz) | **base común**: negocio, horario/abierto, guardar, detalle; capacidad *citas*; `oferta`, `horarios`, `resena`; historias; *Mis cosas*, *Guardados* |
| 2 | Salud | "cédula verificada", capacidad *informativo* |
| 3 | Comida y bebida | capacidad *pedidos* (menú + carrito); `novedad`, `menu`, `nuevo` |
| 4 | Hogar y reparaciones | capacidad *solicitud* (contacto verificado por celular) |
| 5 | Transporte y envíos | capacidad *cotizacion* |
| 6 | Ocio y vida nocturna | `ahora`; vista *Hoy en la colonia* (línea del día, mapa) |
| 7 | Comunidad | `aviso`, `colonia`; fondo vecinal; widgets de la columna derecha |
| 8 | Deportes, Educación, Mascotas, Tiendas, Profesionales | datos nuevos sobre capacidades existentes |

Estado actual: **etapa 1 (Belleza) completa en la UI** con datos dummy (`layers/*/mock.ts`): feed, historias con visor, detalle de negocio, apartar cita, Mis cosas y Guardados. Siguiente: etapa 2 (Salud).
