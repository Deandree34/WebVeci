# features/

Organización por **dominio** de la **lógica** del frontend (no de los componentes visuales).

```
features/<dominio>/
├─ composables/    # lógica de UI/datos del dominio (useXxx)
├─ queries.ts      # consultas / mutaciones de TanStack Query
└─ types.ts        # tipos propios del dominio
```

Los **componentes** de dominio viven en `app/components/<dominio>/` (así Nuxt los
auto-importa como `<DominioPepito>`, p. ej. `FeedPostCard`).

Dominios: `categories`, `businesses`, `feed`, `stories`, `bookings`, `navigation`, `people` (solo cuenta actual); previstos: `auth`, `orders`, `quotes`, `notifications`, `moderation`.

Reglas:
- Un componente nunca llama a `$fetch`: usa `queries.ts` → `app/api`.
- Cada `queries.ts` exporta sus opciones con `queryOptions(...)` para reutilizarlas en
  la precarga de SSR (`prefetchQuery`), además del `useXxx()` que consume el componente.
- Nada de reglas de negocio aquí: esas viven en el backend (proyecto aparte).

Ver `docs/architecture.md` §4.
