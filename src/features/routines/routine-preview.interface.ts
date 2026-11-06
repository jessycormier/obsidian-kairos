import type { ISODate } from "../../core/models/time.type";
import type { BlockRoutine, Routine, TaskRoutine } from "./routines-file.interface";

export interface PreviewDay {
	date: ISODate;
	today: ISODate;
	/** The day's `kairos-routines` value, if its note has one. */
	recorded?: string;
	routines: Routine[];
}

/**
 * One line of a day's routines list, and what adding it writes. A block routine
 * comes with the task routines homed in it, and is added as a whole: routines
 * go in together, not task by task. A task routine whose block is already in
 * the day (or that names a home with no routine of its own) is its own item.
 */
export interface RoutineItem {
	key: string;
	/** The block routine, for a block item. */
	block?: BlockRoutine;
	/** The block's tasks, or the one task of a task item. */
	tasks: TaskRoutine[];
	/** Everything adding this item writes, block first. */
	routines: Routine[];
}

export interface RoutineList {
	/** Block items by start time, then tasks that name a home block. */
	items: RoutineItem[];
	/** Tasks with no block, listed last and muted: allowed, but discouraged. */
	loose: RoutineItem[];
	/** How many routines in all. */
	count: number;
}
