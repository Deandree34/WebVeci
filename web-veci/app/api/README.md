# api/

Capa de **acceso a red**. Único lugar donde se configura y usa el cliente HTTP.

- `client.ts` — instancia base (`baseURL`, credenciales, cabeceras).
- `<recurso>.ts` — endpoints tipados (`categories.ts`, `businesses.ts`, `feed.ts`, `stories.ts`, `bookings.ts`, `people.ts`).
- `mock/` — datos dummy del modelo de negocio (ver `docs/business-model.md`).

**Regla:** los componentes y stores NO llaman a `$fetch`; consumen estos endpoints
(a través de TanStack Query en `features/*/queries.ts`).

Cuando exista el backend, los tipos y hooks se generan desde su **OpenAPI** en
`app/api/generated/` (p. ej. con Orval) y las implementaciones de `<recurso>.ts`
se reemplazan por las llamadas reales, eliminando `mock/`.
