import { isInsideSF } from '../src/services/GeofenceService'

describe('Geofence', () => {
  it('detects point inside polygon', () => {
    expect(isInsideSF({ latitude: 37.77, longitude: -122.45 })).toBe(true)
  })

  it('detects point outside polygon', () => {
    expect(isInsideSF({ latitude: 37.0, longitude: -122.0 })).toBe(false)
  })
})
