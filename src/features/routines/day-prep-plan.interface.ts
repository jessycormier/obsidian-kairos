import type { Block } from "../../core/models/block.interface";
import type { ISODate } from "../../core/models/time.type";
import type { OwnerActive } from "./routine-owners.type";
import type { Routine } from "./routines-file.interface";

export type PrepMode = "auto" | "manual";

export interface PrepInput {
	mode: PrepMode;
	date: ISODate;
	today: ISODate;
	path: string;
	blocks: Block[];
	/** The note's `kairos-routines` value, if it has one. */
	recorded?: string;
	routines: Routine[];
	/** Whether a routine's owner is active on a date; without it, every routine is. */
	active?: OwnerActive;
	/** The "Add routines to new daily notes" setting; only `auto` reads it. */
	autoApply: boolean;
}

export type PrepOutcome =
	| "past" // auto mode on a past day: nothing considered
	| "off" // auto mode with the setting off: nothing
	| "none-due" // no routines occur on this date
	| "added" // at least one routine item was added
	| "present" // routines are due and every one is already in the day
	| "recorded" // auto mode, hash matches: day was set up before
	| "stale";

export interface PrepPlan {
	outcome: PrepOutcome;
	/** This day's blocks after routines. */
	blocks: Block[];
	/** How many routine blocks/tasks were added. */
	added: number;
	/** How many routines occur on this date (active owners only). */
	due: number;
	/** How many more occur but are paused because their owner isn't active. */
	paused: number;
	/** Frontmatter keys to set (string) or delete (null). */
	frontmatter: Record<string, string | null>;
}
