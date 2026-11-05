/**
 * Barra superior escondida (solo celular): al bajar en la página se esconde y al subir
 * reaparece, para dejarle la pantalla al contenido. La controla `SocialTopBar`; lo que
 * se pega debajo de ella (p. ej. las pestañas del negocio) lo lee para subir a `top-0`.
 */
export function useTopBarHidden() {
  return useState('top-bar-hidden', () => false)
}
