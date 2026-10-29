# layers/

Organización por **dominio** con [Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers): cada
carpeta es un módulo autocontenido (componentes, composables, red, caché y estado de cliente), el equivalente al *package-by-feature* de Spring Boot. Nuxt registra automáticamente cada
carpeta de `layers/`; agregar o quitar un dominio es agregar o quitar su carpeta.

```
layers/<dominio>/
├─ nuxt.config.ts   # registra components/ (pathPrefix: false, solo .vue)
├─ components/      # <DominioPepito>.vue — lógica dentro de su <script setup>
├─ composables/     # composables del dominio (auto-importados)
├─ api.ts           # endpoints del dominio (único lugar que llama a `api()` de ~/api/client)
├─ queries.ts       # consultas / mutaciones de TanStack Query (+ queryOptions)
└─ stores.ts        # Pinia: estado de cliente del dominio (uno o varios stores)
```

Cada dominio tiene solo los archivos que necesita. Los **tipos** se quedan centrales en
`app/api/types.ts` (se cruzan entre dominios y luego se generan del OpenAPI).

| Layer | Contenido |
|---|---|
| `auth` | Acceso con celular + código, sin contraseña (`/entrar`: `AuthCard` y sus pasos) |
| `business` | Negocio: perfil, tarjetas, reseñas, guardar/recomendar (`useBusinessSocial`, `useAvailability`, `usePromoCountdown`) |
| `booking` | Apartar cita (`BookingSheet`) y Mis cosas |
| `category` | Catálogo de giros (solo datos) |
| `feed` | Feed de la colonia y sus ventanas (ofertas, reseñas) |
| `notice` | Avisos de la colonia (solo datos) |
| `notification` | Notificaciones del vecino |
| `people` | Cuenta del vecino actual (solo datos) |
| `post` | Piezas de una publicación (cabecera, oferta, fotos, reacciones…) |
| `social` | Shell social: barra superior, navegación, columna derecha (`nav.ts`, `useNavCounters`…) |
| `story` | Historias y su visor |

Lo compartido se queda en `app/`: design system (`components/ui`), `api/`, `utils/`, composables
genéricos (`useNow`, `useModalDialog`…), `useShellPrefetch`, páginas y layouts.

Reglas:
- Un componente nunca llama a `$fetch`: usa `queries.ts` → `api.ts`.
- Dentro del layer se importa en relativo (`./api`, `../queries`); entre layers, con
  `#layers/<otro>/…` (p. ej. `useCurrentUser` de `#layers/people/queries`).
- Los datos dummy no viven aquí: los sirve el mock de la API en `server/` (ver `server/README.md`).
- En el `nuxt.config.ts` de un layer las rutas van relativas (`'components'`): ahí `~` apunta al
  `app/` de la raíz, no al layer.
- Cada `queries.ts` exporta sus opciones con `queryOptions(...)` para reutilizarlas en
  la precarga de SSR (`prefetchQuery`), además del `useXxx()` que consume el componente.
- Nada de reglas de negocio aquí: esas viven en el backend (proyecto aparte).
- Previstos: `orders`, `quotes`, `moderation`.

Ver `docs/architecture.md` §3.1.
