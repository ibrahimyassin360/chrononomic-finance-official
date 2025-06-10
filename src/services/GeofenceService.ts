export type Coordinates = { latitude: number; longitude: number }

// Coordinates outlining the San Francisco city boundary (simplified polygon)
// Values can be tuned or replaced with more accurate data in production.
export const SAN_FRANCISCO_POLYGON: Coordinates[] = [
  { latitude: 37.812, longitude: -122.524 },
  { latitude: 37.703, longitude: -122.524 },
  { latitude: 37.703, longitude: -122.356 },
  { latitude: 37.812, longitude: -122.356 },
]

/**
 * Determine if a point is inside the San Francisco polygon using the
 * ray‑casting algorithm.
 */
export function isInsideSF(point: Coordinates): boolean {
  let inside = false
  for (let i = 0, j = SAN_FRANCISCO_POLYGON.length - 1; i < SAN_FRANCISCO_POLYGON.length; j = i++) {
    const xi = SAN_FRANCISCO_POLYGON[i].longitude
    const yi = SAN_FRANCISCO_POLYGON[i].latitude
    const xj = SAN_FRANCISCO_POLYGON[j].longitude
    const yj = SAN_FRANCISCO_POLYGON[j].latitude

    const intersect = yi > point.latitude !== yj > point.latitude &&
      point.longitude < (xj - xi) * (point.latitude - yi) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}
