# server/ (BFF opcional)

Capa **Nitro** del frontend. Aquí puede vivir un **BFF** (Backend For Frontend) que:

- guarda los tokens en **cookies httpOnly** (el navegador nunca los ve),
- actúa como **proxy** hacia el backend FastAPI,
- agrega/recorta respuestas si hace falta.

Si no se necesita, puede quedar **vacío**: el frontend llama directo al backend.
Ver `docs/architecture.md` §4.5.
