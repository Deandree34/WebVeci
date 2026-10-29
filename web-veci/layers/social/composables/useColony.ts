/**
 * Colonia actual del vecino (por ahora fija; después se podrá cambiar). La muestran el botón
 * del buscador (desde md) y el menú ⋮ del celular, así que el nombre vive en un solo lugar.
 */
export function useColony() {
  return useState('colony', () => 'Col. Centro')
}
