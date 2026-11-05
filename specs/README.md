# specs/ — contrato y SDD

Aquí vive **el contrato** de VECI y **el proceso** con el que se cambia. El código (Nuxt en `web/`,
FastAPI en `api/`) se escribe después del spec, nunca antes.

```
specs/
├─ constitution.md          # reglas que no se negocian
├─ contract/
│  ├─ openapi.yaml          # raíz: info, servers, paths, security
│  ├─ common.yaml           # ApiErrorBody, ApiErrorCode, respuestas de error
│  ├─ auth.yaml             # /auth/otp (provisional)
│  ├─ businesses.yaml · categories.yaml · feed.yaml
│  ├─ bookings.yaml · me.yaml · notices.yaml · stories.yaml
│  └─ redocly.yaml          # reglas de lint del contrato
└─ features/
   └─ README.md             # plantillas de spec.md / plan.md / tasks.md
```

El primer spec será `features/001-acceso/` (WhatsApp inverso + @usuario + passkeys).

## Flujo

1. **Spec** — `features/<NNN>-<nombre>/spec.md`: qué y por qué, en lenguaje de producto.
2. **Aclarar** — las dudas se resuelven *antes* de planear; lo resuelto se escribe en el spec.
3. **Plan** — `plan.md`: cómo, con archivos y orden. Si toca la API, aquí entra el cambio del
   contrato (`contract/*.yaml`).
4. **Tasks** — `tasks.md`: pasos pequeños y verificables.
5. **Implementar** — solo lo que dice el plan. Si aparece algo nuevo, se actualiza el plan primero.

Las plantillas están en [`features/README.md`](features/README.md).

## Contrato

- **OpenAPI 3.1**, un solo archivo raíz (`contract/openapi.yaml`) que referencia los recursos.
- Los nombres de los schemas son los mismos que los tipos de TypeScript (`Business`, `FeedItem`,
  `ApiErrorBody`…): así `web/app/api/types.ts` solo re-exporta y ningún import cambia.
- El contrato se edita **antes** que el código. Ver [`constitution.md`](constitution.md) §2 y §5.

### Herramientas (desde `web/`)

```bash
npm run contract:lint     # valida el yaml (redocly)
npm run contract:bundle   # une los archivos en dist/openapi.bundled.yaml
npm run contract:types    # bundle + genera app/api/generated/schema.d.ts
```

`dist/` es artefacto: no se versiona.

## Servidores

| `servers` | Quién responde |
|---|---|
| `/api/v1` | mock de Nitro en `web/server/api/v1/` (desarrollo) |
| `https://api.veci.mx/v1` | backend FastAPI (producción) |

El mock **imita** el contrato; no es la fuente de verdad.
