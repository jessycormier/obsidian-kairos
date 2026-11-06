import type { Rule } from "./recurrence-rules.type";
import type { BlockRoutine, Routine, TaskRoutine } from "./routines-file.interface";

export interface RoutineGroup {
	/** Stable key for keyed rendering: the rule's `ruleKey`. */
	key: string;
	rule: Rule;
	/** Canonical rule text: "Daily", "Mon, Wed", "Monthly on 1". */
	name: string;
	routines: Routine[];
}

/**
 * One block's slice of a rule group, laid out the way the Grid groups a cell's
 * tasks (decision 70): a header for the block, its tasks under it. That's how
 * the list shows which block a task belongs to, and where "+" adds one.
 */
export interface RoutineBlockGroup {
	key: string;
	/** A timed block routine heading the group. */
	block?: BlockRoutine;
	/** An untimed home with no block routine of its own here ("Night routine"). */
	home?: string;
	/** Neither: the day's Unscheduled list. Always present, always last. */
	unscheduled?: true;
	tasks: TaskRoutine[];
}
