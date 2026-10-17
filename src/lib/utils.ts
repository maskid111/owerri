export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Deterministic naira formatting (identical on server and client). */
export function naira(amount: number) {
  return `₦${String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function priceLabel(level: number) {
  return "₦".repeat(level);
}

/** "07:00" → "7:00 AM" */
export function time12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 && h < 24 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function hoursLabel(open: string, close: string) {
  return `${time12(open)} – ${time12(close)}`;
}

export function distanceLabel(km: number) {
  return km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Day-of-week without touching the clock (Sakamoto's method), safe for prerendering. */
function weekday(y: number, m: number, d: number) {
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  const yy = m < 3 ? y - 1 : y;
  return (yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) + t[m - 1] + d) % 7;
}

export function formatEventDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { day: String(d).padStart(2, "0"), month: MONTHS[m - 1], weekday: WEEKDAYS[weekday(y, m, d)], year: y };
}

/** Returns true when the given time (minutes since midnight) is within opening hours. */
export function isOpenAt(open: string, close: string, minutes: number) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const o = toMin(open);
  let c = toMin(close);
  if (c <= o) c += 24 * 60; // closes after midnight
  const now = minutes < o ? minutes + 24 * 60 : minutes;
  return now >= o && now < c;
}
