/** Cualquier ruta que el mock no conoce responde 404 con el formato del contrato. */
export default defineMockHandler(0, (event) => {
  apiError(404, 'not_found', `Ruta no encontrada: ${event.method} ${event.path}`)
})
