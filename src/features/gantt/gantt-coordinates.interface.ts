import type { ISODate } from "../../core/models/time.type";

// ── Interval presets ─────────────────────────────────────────────────────────
export type Interval = "week" | "month" | "quarter" | "year";

export interface FineTick {
	/** Centered label text. */
	label: string;
	/** Pixel x of the tick's left boundary (where the gridline is drawn). */
	gridX: number;
	/** Pixel x for the centered label. */
	labelX: number;
	/** The ISO date of this tick's left boundary (for date-on-line rendering). */
	date: ISODate;
}

export interface CoarseTick {
	label: string;
	/** Pixel x of the group's left boundary. */
	gridX: number;
	/** Pixel x for the centered label. */
	labelX: number;
	/** Width of the group in pixels. */
	width: number;
}

export interface HeaderModel {
	fine: FineTick[];
	coarse: CoarseTick[];
}
