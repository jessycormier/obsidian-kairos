import type { Association } from "../../core/models/association.type";
import type { TimeRange } from "../../core/models/time.type";
import type { Rule } from "./recurrence-rules.type";

export interface BlockRoutine {
	kind: "block";
	rule: Rule;
	title: string;
	time: TimeRange;
	assoc?: Association;
	metadata?: string;
	/**
	 * The line still has the checkbox a block could once carry. It changes
	 * nothing the routine makes; it only keeps the routines hash such a line
	 * had (see `canonical` in apply-routines.util.ts), so days set up from it don't go stale.
	 * Editing the routine rewrites the line without it.
	 */
	legacyCheckbox?: true;
	line: number;
}

export interface TaskRoutine {
	kind: "task";
	rule: Rule;
	text: string;
	/** Explicit association written on the routine line. */
	assoc?: Association;
	/** The home line's association, which the task inherits when it has none. */
	inherited?: Association;
	metadata?: string;
	/** Title of the block it belongs in; absent → the day's Unscheduled list. */
	home?: string;
	line: number;
}

export type Routine = BlockRoutine | TaskRoutine;

export interface RoutineProblem {
	line: number;
	message: string;
}

export interface ParsedRoutines {
	routines: Routine[];
	problems: RoutineProblem[];
}
