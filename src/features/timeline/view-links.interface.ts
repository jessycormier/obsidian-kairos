import type { ISODate } from "../../core/models/time.type";
import type { TimelineDrop } from "./task-drop.interface";

/**
 * A request for the Day view to show `date`. `nonce` makes repeats distinct.
 * `explicit` marks a direct ask (a Grid column header click), which the Day
 * view honours even when it isn't following the Grid.
 */
export interface FocusRequest {
	date: ISODate;
	nonce: number;
	explicit: boolean;
}

/** A live task drag, as every timeline needs to see it. */
export interface DragPreview {
	/** Where the dragged task sits now, so its row can dim in any view. */
	from: { date: ISODate; line: number };
	/** Where it would land if released now, or null over nothing droppable. */
	drop: TimelineDrop | null;
	/** The title a drop on empty time would give the new block. */
	label: string;
	/** Modifier state, so the preview can show "copy". */
	duplicate: boolean;
}

/**
 * The item under the pointer. `block` is the line of the block it lights up as
 * a whole: the block itself, or the timed block a task sits in. A task in an
 * untimed block (Unscheduled) has none, so pointing at it lights only it.
 */
export interface HoverTarget {
	kind: "task" | "block";
	path: string;
	line: number;
	block?: number;
}

/** How an item is lit: as part of the hovered block, or as the hovered task. */
export type Highlight = "block" | "task" | null;
