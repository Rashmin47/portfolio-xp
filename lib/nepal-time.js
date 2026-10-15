/**
 * Kathmandu time helpers.
 *
 * Nepal Standard Time is a fixed UTC+05:45 offset with no daylight saving, so
 * plain UTC arithmetic is exact and needs no timezone database. Every clock in
 * the UI (menu bar, LocalTime, the 3D window's light phase) reads from here.
 */

const NEPAL_OFFSET_MINUTES = 345; // UTC+05:45

/** Minutes past midnight in Kathmandu (0–1439). */
export function nepalMinutes(date = new Date()) {
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  return (utcMinutes + NEPAL_OFFSET_MINUTES) % 1440;
}

/** "HH:MM" 24-hour clock in Kathmandu. */
export function nepalClock(date = new Date()) {
  const minutes = nepalMinutes(date);
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

/**
 * Coarse light phase for the scene: day, evening or night.
 * Day 05:30–17:00, evening 17:00–19:30, night otherwise.
 */
export function nepalPhase(date = new Date()) {
  const hour = nepalMinutes(date) / 60;
  if (hour >= 5.5 && hour < 17) return "day";
  if (hour >= 17 && hour < 19.5) return "evening";
  return "night";
}
