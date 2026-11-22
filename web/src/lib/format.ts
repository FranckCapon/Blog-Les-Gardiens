// Mise en forme des dates et durées, toujours à l'heure de Paris.
const TZ = "Europe/Paris";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: TZ });
const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TZ,
});
const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: TZ });
const monthFmt = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: TZ });

export const formatDate = (d: Date) => dateFmt.format(d);
export const formatDateTime = (d: Date) => dateTimeFmt.format(d).replace(":", " h ");
export const formatDay = (d: Date) => dayFmt.format(d);
export const formatMonth = (d: Date) => monthFmt.format(d).replace(".", "");

export function formatPlayers(min: number, max: number | null) {
  if (max == null) return `${min} joueur${min > 1 ? "s" : ""} et +`;
  if (max === min) return `${min} joueur${min > 1 ? "s" : ""}`;
  return `${min} à ${max} joueurs`;
}

export function formatDuration(minutes: number | null) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

/** Heure courante arrondie à l'heure, pour partager les résultats en cache. */
export function currentHour() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d.toISOString();
}

const partsFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** Date → « AAAA-MM-JJTHH:MM » à l'heure de Paris (valeur d'un champ datetime-local). */
export function toParisInput(d: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** « AAAA-MM-JJTHH:MM » saisi à l'heure de Paris → Date (null si invalide). */
export function fromParisInput(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!m) return null;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const wanted = Date.UTC(y, mo - 1, d, h, mi);
  // On part de l'heure UTC puis on corrige du décalage de Paris (deux passes
  // suffisent, y compris autour des changements d'heure).
  let guess = wanted;
  for (let i = 0; i < 2; i++) {
    const shown = new Date(`${toParisInput(new Date(guess))}:00Z`).getTime();
    guess += wanted - shown;
  }
  const result = new Date(guess);
  return toParisInput(result) === value ? result : null;
}
