import type { LifecycleState } from "../../core/models/project.interface";
import type { ISODate } from "../../core/models/time.type";

/** Everything `row-label.component.svelte` needs to render one row's label + hover card. */
export interface RowLabelInfo {
	name: string;
	/** True for a domain row (draws the tinted domain icon on the right). */
	isDomain: boolean;
	/** The group accent color; undefined → neutral (e.g. an orphan project). */
	color?: string;
	/** The entity's free-text description (blurb) — shown in the hover card only. */
	description: string;
	/** The status in effect as of the reference day. */
	status: LifecycleState;
	/** The effective record's note — the "status description" subline; "" hides it. */
	note: string;
	/** Start of the current status span; null when the default active applies. */
	since: ISODate | null;
	/** End of the current span; null → still open ("ongoing"). */
	until: ISODate | null;
	/**
	 * Grid rows only: the 0–5 intensity on `on`, the first visible day, drawn as
	 * bars beside the name. Absent when the row has no level that day. The Grid
	 * marks later changes in its cells, so the label is the starting point.
	 */
	intensity?: { level: number; on: ISODate };
	/**
	 * Grid domain rows only: the projects rolled up onto this row (#11), by
	 * name. Absent/empty when none — they have no row of their own, so the
	 * domain's label is where they stay visible.
	 */
	rolledUp?: string[];
	/**
	 * Timeline project rows only: the name of the domain whose Grid row this
	 * project is rolled up onto (#11). Draws a small marker beside the name; the
	 * Timeline still gives the project its own row.
	 */
	rolledUpOnto?: string;
}
