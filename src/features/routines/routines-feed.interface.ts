import type { SourceRef } from "../../core/models/source-ref.interface";
import type { ISODate } from "../../core/models/time.type";
import type { OwnerActive } from "./routine-owners.type";
import type { ParsedRoutines, Routine } from "./routines-file.interface";
import type { Readable } from "svelte/store";

/** The recorded routines hash for a date, or undefined. */
export type RoutineMarks = (date: ISODate) => string | undefined;

/** What a view needs to show a day's routines alert and act on it. */
export interface RoutineActions {
	routines$: Readable<ParsedRoutines>;
	marks$: Readable<RoutineMarks>;
	active$: Readable<OwnerActive>;
	/** Add one item (a block with its tasks, or a task); doesn't record the day. */
	insert: (date: ISODate, routines: Routine[]) => void;
	/** Add everything missing and record the day as set up. */
	addAll: (date: ISODate) => void;
	/** Preview how the day differs from its routines, and apply what's picked. */
	regenerate: (date: ISODate) => void;
}

/** What the Day view needs to offer the previous day's leftovers and act on them. */
export interface LeftoverActions {
	/** The day a date's note says its leftovers came from, if they were dealt with. */
	carried$: Readable<RoutineMarks>;
	/** Bring the tasks at `which` (or every leftover) from `from` into `date`. */
	bring: (date: ISODate, from: ISODate, which?: SourceRef[]) => void;
	/** Leave the rest where they are and stop offering them on `date`. */
	leave: (date: ISODate, from: ISODate) => void;
}
