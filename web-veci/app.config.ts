export default defineAppConfig({
  icon: {
    // Modo CSS: el icono es una máscara que hereda color (currentColor) y
    // tamaño (font-size) del contexto, ideal para uso inline junto a texto.
    mode: 'css',
    // Requerido con Tailwind v4: inyecta los estilos del icono en una capa conocida
    // para que no se filtren ni queden pisados por las utilidades.
    cssLayer: 'base',
    // Tamaño por defecto, relativo al texto del contenedor.
    size: '1.15em'
  }
})
