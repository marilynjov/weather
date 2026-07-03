// Shared location resolver so every page detects the user's location the
// same way. If a city is typed, use it. Otherwise ask the browser for GPS
// coordinates, falling back to IP-based lookup ("auto:ip") if geolocation
// is unavailable, denied, or times out.
export function getLocationQuery(typed?: string): Promise<string> {
  if (typed && typed.trim() !== "") {
    return Promise.resolve(typed.trim());
  }

  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return Promise.resolve("auto:ip");
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => resolve("auto:ip"),
      { timeout: 10000 }
    );
  });
}
