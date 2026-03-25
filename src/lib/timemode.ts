/**
 * NYC time mode system.
 * Returns "day" | "dusk" | "night" based on current NYC (EST/EDT) time.
 * Also returns the formatted time string for the clock.
 */

export type TimeMode = "day" | "dusk" | "night";

export function getNYCTime(): { mode: TimeMode; formatted: string; hour: number; minute: number } {
  const now = new Date();
  const nyc = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hour = nyc.getHours();
  const minute = nyc.getMinutes();

  let mode: TimeMode;
  if (hour >= 6 && hour < 16) {
    mode = "day";
  } else if (hour >= 16 && hour < 19) {
    mode = "dusk";
  } else {
    mode = "night";
  }

  const formatted = nyc.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  }) + " EST";

  return { mode, formatted, hour, minute };
}
