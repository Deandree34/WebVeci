# server/ (Nitro)

## Mock de la API (temporal)

Mientras no existe el backend FastAPI, Nitro sirve una **API de mentira** que cumple el mismo
contrato (`docs/architecture.md` §6): mismas rutas, status HTTP, cuerpos y formato de error.
El frontend la consume por HTTP real con la URL base `/api/v1` (la de por defecto).

```
server/
├─ api/v1/              # rutas: GET /api/v1/feed, POST /api/v1/bookings…
│  └─ [...].ts          # cualquier otra ruta → 404 not_found
├─ mock/                # datos dummy y reglas simuladas (OTP) por dominio
└─ utils/mock-api.ts    # defineMockHandler (latencia + errores), apiError, validationError
```

- **Éxito:** el handler devuelve el recurso tal cual.
- **Error:** `apiError(status, code, message, details?)` o `validationError({ campo: 'mensaje' })`
  responden `{ error: { code, message, details? } }` con ese status. Cualquier otra excepción sale
  como `500 internal_error`.

Para agregar un endpoint: crea `server/api/v1/<ruta>.<método>.ts` con `defineMockHandler(latenciaMs, …)`
y su llamada en `layers/<dominio>/api.ts`.

**Al conectar el backend real:** `NUXT_PUBLIC_API_BASE_URL=https://…/v1` y se borran `api/v1/`,
`mock/` y `utils/mock-api.ts`. Los `api.ts`, queries y componentes no cambian.

## BFF: no hay

El **BFF no existe** y no se va a agregar: la sesión la emite **FastAPI** en una cookie `httpOnly` +
`Secure` + `SameSite=Lax` (`Domain=.veci.mx`), y el navegador la manda sola con
`credentials: 'include'` (ver `app/api/client.ts`). Nitro solo sirve el mock y desaparece cuando
entre el backend real.

Ver `docs/architecture.md` §4.5.
