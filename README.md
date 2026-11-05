# VECI

Red social de barrio: negocios de la colonia, feed, historias, citas y avisos.

Monorepo con el contrato de API como fuente única de verdad:

```
WebVeci/
├─ specs/     # constitución + contrato OpenAPI + specs de features (SDD)
├─ web/       # frontend Nuxt 4 (SSR) — capa de presentación
├─ api/       # backend FastAPI (en construcción)
└─ docs/      # documentos de producto compartidos
```

## Empezar

- Reglas del proyecto: [`specs/constitution.md`](specs/constitution.md)
- Flujo de trabajo (spec → plan → tasks → código): [`specs/README.md`](specs/README.md)
- Contrato de la API: [`specs/contract/openapi.yaml`](specs/contract/openapi.yaml)
- Frontend: [`web/README.md`](web/README.md) · Arquitectura: [`web/docs/architecture.md`](web/docs/architecture.md)
- Producto: [`docs/business-model.md`](docs/business-model.md)

```bash
cd web
npm install
npm run dev      # http://localhost:3001
```

## Regla de oro

**El contrato se cambia antes que el código.** Un cambio de API sin cambio en `specs/contract/` es
un bug, aunque funcione.
