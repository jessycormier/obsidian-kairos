import type { BacklogEntry } from "../../core/models/backlog-entry.interface";

/** How to order entries within a group. */
export type BacklogSort = "manual" | "resurface" | "alpha";

/**
 * Which entries to show. A backlog entry's only form of scheduling is its
 * resurface date — the day it comes back to ask to be done — so "scheduled"
 * means it carries one and "unscheduled" means it doesn't.
 */
export type BacklogSchedule = "all" | "scheduled" | "unscheduled";

export interface BacklogGroup {
	/** Stable key for keyed rendering: `project:Name`, `domain:Name`, or `none`. */
	key: string;
	/** Display name — the current canonical name, or "Unassociated". */
	name: string;
	/** Group kind, for the row accent / icon. */
	kind: "project" | "domain" | "none";
	/** Domain color, if one applies (via resolver). Absent for Unassociated. */
	color?: string;
	/** The entries in this group, ordered per the active sort. */
	entries: BacklogEntry[];
}
