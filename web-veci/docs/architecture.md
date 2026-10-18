# Arquitectura — VECI (Frontend)

> Documento vivo. Define la arquitectura del **frontend** de VECI (red social), diseñado para **escala enterprise**. El **backend FastAPI vive en un proyecto aparte**; este proyecto solo lo **consume**.

---

## 0. Resumen ejecutivo

| Ámbito | Decisión |
|---|---|
| Estilo | Proyecto **Nuxt único** (sin monorepo), backend **desacoplado** como servicio externo, **API-first** |
| Frontend | **Nuxt 4** (SSR) + Vue 3 + Tailwind v4 — **capa de presentación** |
| Backend | **FastAPI (Python)** — **proyecto aparte** (no vive aquí) |
| Contrato | REST **versionada `/v1`**, **OpenAPI** como fuente única de tipos |
| Cliente API | Tipos/hooks generados desde el OpenAPI (Orval) → `app/api/generated` |
| Estado | **Pinia** (estado de cliente) + **TanStack Query** (estado de servidor) |
| Auth | OIDC/JWT; tokens en **cookie httpOnly** mediante un **BFF** |
| Tiempo real | **Diferido**; se define una interfaz `RealtimeService` desacoplada |
| Gestor de paquetes | **npm** (proyecto Nuxt único) |

---

## 1. Visión general

VECI es una red social. El **frontend** y el **backend** son **desplegables de forma independiente** y viven en **repositorios/proyectos distintos**:

```
┌──────────────────────────────┐         HTTPS / JSON        ┌──────────────────────────────┐
│  web-veci  (este proyecto)   │  ─────────────────────────▶ │  Backend FastAPI             │
│  Nuxt 4 (SSR)                │  ◀───────────────────────── │  (proyecto aparte)           │
│  Presentación                │        REST /v1             │  Negocio + datos             │
└──────────────────────────────┘                             └──────────────┬───────────────┘
        │                                                                   │
        │ (opcional) BFF Nitro: cookies httpOnly                            ▼
        │                                                        ┌────────────────────┐
        ▼                                                        │   PostgreSQL       │
   Navegador                                                     └────────────────────┘
                                                                 ┌────────────────────┐
                                                                 │ Redis · S3/R2 · …  │
                                                                 └────────────────────┘
```

**Principios rectores**

1. **Separación de responsabilidades.** El frontend presenta; el backend decide. Ninguna regla de negocio vive en el frontend.
2. **El contrato manda.** El OpenAPI del backend es la fuente única de tipos del frontend. Si el contrato cambia, el frontend **rompe en compilación**, no en producción.
3. **Feature-first.** La organización es por **dominio** (feed, posts, auth…), no por tipo de archivo, para permitir equipos en paralelo.
4. **Estado bien tipado.** Se distingue estrictamente *estado de servidor* de *estado de cliente*.
5. **Desacoplamiento del tiempo real.** Aunque hoy no se implemente, la interfaz queda definida para no reescribir features después.

---

## 2. Stack tecnológico

### Frontend (proyecto Nuxt, `web-veci`)

| Área | Tecnología |
|---|---|
| Framework | Nuxt 4 (SSR) + Vue 3 |
| Routing | File-based de Nuxt (`app/pages`) |
| Estilos | Tailwind CSS v4 (CSS-first) + design tokens propios |
| Fuentes | **Roboto** + **Roboto Mono** (Google / Material Design) vía `@nuxt/fonts` (self-hosted) |
| Iconos | **Material Symbols** (set de Google) vía `@nuxt/icon` + Iconify local |
| Estado de servidor | **@tanstack/vue-query** |
| Estado de cliente | **Pinia** |
| Formularios | **vee-validate** + **Zod** |
| Cliente HTTP | **openapi-fetch** u hooks generados por **Orval** |
| Testing | Vitest (unit) + Playwright (e2e) |

### Backend externo (proyecto aparte — para referencia)

| Área | Tecnología |
|---|---|
| Framework | **FastAPI** (Python) |
| ORM / DB | **SQLAlchemy 2** (async) · **PostgreSQL** · **Alembic** |
| Auth | OIDC/JWT |
| Calidad | Ruff · mypy · pytest |

> El frontend **no** compila ni ejecuta nada de Python. Solo consume su API REST.

---

## 3. Estructura del proyecto

Proyecto **Nuxt único** (sin monorepo):

```
web-veci/
├─ app/
│  ├─ api/                     # capa de red (ÚNICO lugar con $fetch)
│  │  ├─ client.ts             # instancia base (baseURL, credenciales, cabeceras)
│  │  ├─ types.ts              # tipos del dominio (hoy; luego generados del OpenAPI)
│  │  └─ <recurso>.ts          # endpoints (posts.ts, stories.ts, people.ts…)
│  ├─ components/
│  │  ├─ ui/                   # design system (BButton, BCard, BTag…) -> <BButton>
│  │  └─ <dominio>/            # componentes de dominio -> <FeedPostCard>, <SocialTopBar>, <StoryCard>
│  ├─ features/<dominio>/      # LÓGICA de dominio
│  │  ├─ composables/          # useXxx del dominio
│  │  └─ queries.ts            # consultas/mutaciones de TanStack Query (+ queryOptions)
│  ├─ composables/             # composables transversales (useApi, useSession…)
│  ├─ stores/                  # Pinia (estado de cliente)
│  ├─ middleware/              # guardas de ruta (auth, roles)
│  ├─ plugins/                 # registro de TanStack Query, etc. (vue-query.ts)
│  ├─ utils/                   # helpers puros (formatDate…)
│  ├─ layouts/                 # default.vue (landing) · social.vue (app social)
│  ├─ pages/                   # index.vue (/) · home.vue (/home) · feed.vue
│  ├─ assets/  public/
│  └─ app.vue
├─ server/                     # BFF opcional (Nitro)
├─ docs/                       # design/ + architecture.md
├─ nuxt.config.ts
├─ package.json
└─ .env.example
```

---

## 4. Frontend — Nuxt 4 (solo presentación)

### 4.1 Capas

```
1. Presentación      app/pages · app/layouts · app/components/ui · app/components/<dominio>
2. Estado cliente    app/stores            (Pinia: sesión, UI global, preferencias)
3. Datos servidor    app/features/<d>/queries.ts (TanStack Query: caché, infinite, optimistic)
4. Acceso a red      app/api               (cliente HTTP + endpoints tipados)
5. Contrato          OpenAPI → tipos       (hoy en app/api/types.ts; luego generados)
6. BFF (opcional)    server/               (Nitro: proxy, cookies httpOnly)
```

### 4.2 Auto-import de componentes

Para que el design system conserve el nombre `B*` estando en una subcarpeta, el
`nuxt.config.ts` define:

```ts
components: [
  { path: '~/components/ui', pathPrefix: false },                 // <BButton>
  { path: '~/components', pathPrefix: true, ignore: ['ui/**'] }   // <FeedPostCard>
]
```

Regla práctica: **componentes visuales** en `app/components/<dominio>/`; **lógica de
dominio** en `app/features/<dominio>/`.

### 4.3 Estado: Pinia vs TanStack Query

Esta separación es **obligatoria**.

| Tipo de estado | Herramienta | Ejemplos |
|---|---|---|
| **De servidor** (vive en el backend) | **TanStack Query** | feed, posts, perfil, notificaciones |
| **De cliente** (solo UI/local) | **Pinia** | sesión cacheada, menú abierto, tema, borradores |

> ❌ Nunca guardar el feed (ni ningún dato del backend) en Pinia.

TanStack Query aporta: caché con *stale time*, `infiniteQuery` para el scroll del feed,
`mutation` con **optimistic updates** (likes/follows) e invalidación por claves.

### 4.4 Acceso a datos

Los componentes **nunca** llaman a `$fetch` directamente. Toda comunicación pasa por
`app/api` y se consume desde `features/*/queries.ts`.

```ts
// app/api/posts.ts
import { createApiClient } from './client'
const api = createApiClient()

export const postsApi = {
  feed: (cursor?: string) => api('/feed', { query: { cursor } }),
  like: (id: string) => api(`/posts/${id}/like`, { method: 'POST' })
}
```

```ts
// app/features/feed/queries.ts
export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => postsApi.feed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor
  })
}
```

> **Estado actual (temporal):** `app/api/posts.ts` devuelve **datos dummy** (`app/api/mock/`)
> con latencia simulada, para desarrollar la UI antes de tener backend. Al conectar el
> backend, solo se reemplaza el cuerpo de `postsApi` (y se borra `app/api/mock/`).

Cada dominio exporta además sus opciones como `queryOptions` **reutilizables**, de modo
que el componente y la precarga en SSR compartan definición:

```ts
// app/features/people/queries.ts
export const contactsOptions = queryOptions({
  queryKey: peopleKeys.contacts,
  queryFn: () => peopleApi.contacts()
})

export function useContacts() {
  return useQuery(contactsOptions)
}
```

```ts
// app/layouts/social.vue — precarga el shell antes de renderizar en SSR
if (import.meta.server) {
  const queryClient = useQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(storiesOptions),
    queryClient.prefetchQuery(contactsOptions),
    queryClient.prefetchQuery(suggestionsOptions)
  ])
}
```

> El plugin `app/plugins/vue-query.ts` es **universal**: en SSR **deshidrata** la caché
> al payload (`dehydrate`) y en el cliente la **rehidrata** (`hydrate`). Cuando una vista
> no necesita datos en el HTML inicial, o su render no es determinista (p. ej. fechas
> formateadas), se envuelve en `<ClientOnly>` (ver `pages/home.vue`).

### 4.5 BFF y autenticación

- El frontend **no** almacena tokens en `localStorage`/memoria.
- El **BFF** (`server/`) intercambia el token con el backend y lo guarda en **cookie httpOnly + Secure + SameSite**.
- En enterprise, la identidad suele ser **OIDC/OAuth2** contra un IdP (Keycloak, Auth0, Entra ID). El BFF actúa como *confidential client*.
- Los **guards** de ruta (`app/middleware`) bloquean rutas privadas.

### 4.6 Convenciones de componentes

- **Design system** en `app/components/ui` (prefijo `B*`): sin lógica de negocio, solo props + slots.
- **Componentes de dominio** en `app/components/<dominio>`: orquestan datos vía composables/queries.
- **Composables** (`useX`) contienen orquestación de UI y datos, **no** reglas de negocio.

---

## 5. Backend externo — FastAPI (contrato)

El backend **no vive en este proyecto**. Aun así, su forma condiciona el frontend:

```
[ api/v1/*.py ]        Routers  → validan entrada (Pydantic) y delegan.  ≈ Controllers
[ services/*.py ]      Lógica de negocio y reglas del dominio.          ≈ Services
[ repositories/*.py ]  Acceso a datos (SQLAlchemy).                     ≈ Repositories
        ↓
   PostgreSQL
```

**Regla (para el equipo de backend):** un router nunca accede a la base de datos
directamente; siempre pasa por un service.

---

## 6. Contrato de API

| Aspecto | Regla |
|---|---|
| Versionado | Prefijo de ruta: `/v1/...` |
| Formato | JSON; `snake_case` en payloads |
| Paginación de listas | **Por cursor** en feed/notificaciones: `?cursor=&limit=` |
| Errores | Estructura uniforme: `{ error: { code, message, details? } }` |
| Idempotencia | Acciones repetibles (likes/follows) idempotentes |
| Fechas | ISO-8601 en UTC |
| Auth | `Authorization: Bearer <jwt>` (o cookie vía BFF) |
| Documentación | OpenAPI en `GET /v1/openapi.json` + Swagger UI |

**Flujo de tipos (obligatorio):**

```
Backend FastAPI  ──▶  OpenAPI (json)  ──▶  Orval  ──▶  app/api/generated (TS)
                                                              │
                                                              ▼
                                                    web-veci (tipado estricto)
```

Regeneración: descarga el `openapi.json` del backend y ejecuta la generación
(p. ej. `npx orval`), que escribe en `app/api/generated/`. En CI, el *contract check*
falla si los tipos generados no están actualizados.

---

## 7. Modelo de dominio

El modelo de negocio completo (categorías, capacidades, entidades, tipos de publicación y hoja
de ruta) está en **[business-model.md](business-model.md)**. Resumen:

| Entidad | Descripción |
|---|---|
| `User` | Cuenta del vecino (alta por código al celular; sin contraseña) |
| `Category` | Giro del negocio (belleza, salud, comida…) |
| `Business` | Negocio de la colonia: horario, ubicación, rating, recomendaciones, capacidades |
| `Service` / `Availability` | Servicios con precio y horarios libres (capacidad *citas*) |
| `Promo` / `Review` | Oferta con vigencia; reseña destacada de un vecino |
| `FeedItem` | Publicación tipada con acción (`oferta`, `horarios`, `resena`, …) |
| `Story` | Historia de 24 h de un negocio o de VECI |
| `Booking` | Cita apartada por un vecino |
| `Notice` / `NeighborhoodFund` | Avisos y fondo vecinal (categoría *Comunidad*) |
| `Notification` · `Report` | Avisos al vecino · moderación |

> Fuera del modelo **por regla**: likes, comentarios, seguidores/amigos y publicaciones de vecinos.
>
> **Feed:** consulta por cursor + índices; el orden por relevancia (franja horaria, abierto ahora, vigencia de ofertas) lo calcula el backend.

---

## 8. Tiempo real (diferido)

No se implementa ahora, pero se **desacopla** mediante una interfaz en el frontend:

```ts
// app/composables/useRealtime.ts
export interface RealtimeService {
  connect(): Promise<void>
  subscribe(channel: string, cb: (payload: unknown) => void): () => void
  disconnect(): void
}
```

Hoy: implementación *no-op*. Mañana: se sustituye por Centrifugo / Soketi / Ably / Supabase Realtime **sin tocar las features**.

> ⚠️ Nitro (Nuxt) no sostiene WebSockets en entornos serverless. Si se elige serverless, el tiempo real debe vivir en un servicio aparte o en el backend.

---

## 9. Media (imágenes/vídeo)

- Los archivos van a **object storage** (S3 / Cloudflare R2).
- El backend emite **URLs firmadas** para subida/descarga directa (el archivo **no** pasa por el backend).
- Metadatos (autor, tipo, dimensiones) en `Media`.

---

## 10. Seguridad

- Transporte **HTTPS** obligatorio; CORS restringido a orígenes conocidos.
- Tokens en **cookie httpOnly** (BFF) o Bearer de corta vida + refresh.
- **Rate limiting** en el backend en endpoints sensibles (login, registro, publicar).
- Validación **en ambos lados**: el frontend valida para UX; el backend **siempre** revalida.
- Principio de mínimo privilegio en credenciales.

---

## 11. Observabilidad

- **Frontend:** Sentry (errores) + OpenTelemetry (trazas de navegación).
- **Correlación:** propagar un `X-Request-Id` desde el frontend/BFF al backend.

---

## 12. Testing

| Nivel | Frontend |
|---|---|
| Unit | Vitest |
| Componente | @nuxt/test-utils / Vue Test Utils |
| E2E | Playwright |
| Contrato | Orval schema / MSW |

---

## 13. CI/CD

- **Pipeline** con caché de npm.
- Etapas: `lint → typecheck → test → build`.
- **Contract check**: fallar el PR si el OpenAPI del backend cambió y los tipos generados no se regeneraron.

---

## 14. Convenciones transversales

- **TypeScript estricto** (`strict: true`).
- **Nombres:** componentes en `PascalCase`; composables `useXxx`; ficheros de API en `camelCase`.
- **Commits:** Conventional Commits.
- **Ramas:** trunk-based o GitHub Flow.
- **Idioma:** UI en español (`lang="es"`); identificadores de código en inglés.

---

## 15. Roadmap de adopción (por fases)

| Fase | Alcance |
|---|---|
| **1. Shell** (hecho) | Proyecto Nuxt único en `web-veci/` con la estructura (`api/`, `components/ui`, `features/`, `composables/`, `stores/`, `plugins/`, `utils/`) + `docs/architecture.md` |
| **2. Datos** (dummy hecho) | `app/api/client.ts` + capa de datos con TanStack Query (hoy con datos dummy); al llegar el backend, tipos generados del OpenAPI |
| **2b. Shell social** (hecho) | Layout `social.vue` + `/home`: barra superior con búsqueda, historias, composer, feed, navegación inferior/lateral y columna derecha (datos dummy; historias/búsqueda/navegación como *placeholder* visual) |
| **3. Auth** | Registro/login, JWT + BFF con cookies, guards de ruta |
| **4. Feed** | Post, feed por cursor, infinite scroll, likes optimistas (contra backend real) |
| **5. Social** | Perfiles, follow, comentarios, notificaciones |
| **6. Media** | Subida directa a S3/R2 con URLs firmadas |
| **7. Moderación** | Reportes, bloqueos, panel de moderación |
| **8. Realtime** | Chat y notificaciones en vivo mediante `RealtimeService` |

---

## 16. Decisiones (ADR resumido) y alternativas descartadas

| Decisión | Elección | Alternativa descartada | Motivo |
|---|---|---|---|
| Backend | FastAPI en **proyecto aparte** | Monolito Nuxt/Nitro | Requisito enterprise, equipos independientes |
| Empaquetado | Proyecto Nuxt único | Monorepo con workspaces | El backend está aparte; no hace falta monorepo |
| Contrato | OpenAPI + Orval | Tipos escritos a mano | Evita deriva y errores en producción |
| Estado servidor | TanStack Query | Solo Pinia | Caché, paginación y optimistic out-of-the-box |
| SSR de datos | Plugin universal (`dehydrate`/`hydrate`) + `queryOptions` precargadas | Delegar todo a `<ClientOnly>` | El HTML inicial llega con contenido y sin desajustes de hidratación |
| Estado cliente | Pinia | refs globales manuales | Estándar, devtools, tipado |
| Componentes | `components/ui` + `components/<dominio>` | Todo en `features/` | Nombres auto-importados limpios en Nuxt |
| Tiempo real | Diferido + interfaz | Implementar ya | Evita sobrediseño sin caso de uso definido |
| Tipografía | **Roboto** + **Roboto Mono** | Michroma / Inter / JetBrains Mono | Alineado con el ecosistema Google / Material Design |
| Iconos | **Material Symbols** (`@nuxt/icon`) | Emojis y símbolos de texto | Set oficial de Google, self-hosted y consistente |
| Gestor de paquetes | npm | pnpm | Igual que el proyecto original |

---

*Última actualización: 2026-10-17.*
