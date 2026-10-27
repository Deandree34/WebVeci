# features/

Organización por **dominio**: todo lo de un dominio (red, datos dummy, caché y estado
de cliente) vive en una sola carpeta. Agregar o quitar un dominio es agregar o quitar
su carpeta (y sus componentes).

```
features/<dominio>/
├─ api.ts       # endpoints del dominio (único lugar con $fetch); hoy devuelven el mock
├─ mock.ts      # datos dummy con latencia simulada (temporal: se borra con el backend)
├─ queries.ts   # consultas / mutaciones de TanStack Query (+ queryOptions)
└─ stores.ts    # Pinia: estado de cliente del dominio (uno o varios stores)
```

Cada dominio tiene solo los archivos que necesita. Los **tipos** se quedan centrales en
`app/api/types.ts` (se cruzan entre dominios y luego se generan del OpenAPI).

Los **componentes** de dominio viven en `app/components/<dominio>/` (así Nuxt los
auto-importa como `<DominioPepito>`, p. ej. `FeedPostCard`).

Dominios: `categories`, `businesses`, `feed`, `stories`, `bookings`, `navigation`, `people` (solo cuenta actual), `notifications`, `notices`; previstos: `auth`, `orders`, `quotes`, `moderation`.

Reglas:
- Un componente nunca llama a `$fetch`: usa `queries.ts` → `api.ts`.
- Dentro del dominio se importa en relativo (`./api`, `./mock`); entre dominios, con
  `~/features/<otro>/…` (p. ej. los mocks usan `findBusiness` de `businesses/mock`).
- Cada `queries.ts` exporta sus opciones con `queryOptions(...)` para reutilizarlas en
  la precarga de SSR (`prefetchQuery`), además del `useXxx()` que consume el componente.
- Nada de reglas de negocio aquí: esas viven en el backend (proyecto aparte).

Ver `docs/architecture.md` §4.
