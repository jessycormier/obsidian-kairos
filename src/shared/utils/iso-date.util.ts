// Whole-day arithmetic on `YYYY-MM-DD` strings, with no obsidian or moment
// dependency. Dates are parsed at UTC noon and diffed in whole days, which
// sidesteps DST and timezone drift. (core/note/day-note.util.ts has
// moment-based date helpers for the daily notes themselves.)

import type { ISODate } from "../../core/models/time.type";

const MS_PER_DAY = 86_400_000;

/** Parse an ISO date at UTC noon (DST-proof anchor for day arithmetic). */
export function parseUTCNoon(date: ISODate): number {
	const [y, m, d] = date.split("-").map(Number) as [number, number, number];
	return Date.UTC(y, m - 1, d, 12, 0, 0);
}

/** Format a UTC-noon timestamp back to an ISO date. */
function isoFromUTC(ms: number): ISODate {
	const dt = new Date(ms);
	const p = (n: number) => String(n).padStart(2, "0");
	return `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())}`;
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: ISODate, to: ISODate): number {
	return Math.round((parseUTCNoon(to) - parseUTCNoon(from)) / MS_PER_DAY);
}

/** Shift an ISO date by whole days. */
export function shiftDays(date: ISODate, days: number): ISODate {
	return isoFromUTC(parseUTCNoon(date) + days * MS_PER_DAY);
}
