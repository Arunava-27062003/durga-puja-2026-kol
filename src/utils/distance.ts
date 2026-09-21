const EARTH_RADIUS_KM = 6371;

type Coords = { lat: number; lng: number };

/** Great-circle distance between two lat/lng points, in kilometres. */
export function getDistanceKm(a: Coords, b: Coords): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** "850 m" under 1km, otherwise "3.2 km". */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

// ponytail self-check: getDistanceKm(SaltLake, SaltLake) ≈ 0, and Kolkata↔Delhi ≈ 1300km.
if (__DEV__) {
  console.assert(getDistanceKm({ lat: 22.58, lng: 88.41 }, { lat: 22.58, lng: 88.41 }) < 0.001);
  console.assert(
    Math.abs(getDistanceKm({ lat: 22.5726, lng: 88.3639 }, { lat: 28.6139, lng: 77.209 }) - 1305) <
      50,
  );
}
