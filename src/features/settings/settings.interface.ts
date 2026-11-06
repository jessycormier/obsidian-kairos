export interface KairosSettings {
	/** First hour shown in the day timeline (0–23). */
	timelineStartHour: number;
	/** Last hour shown in the day timeline (1–24, must exceed start). */
	timelineEndHour: number;
	/** Pixels per hour in the day timeline. */
	timelineHourHeight: number;

	/**
	 * Week view window, expressed as a span around today. The default window the
	 * Week view opens on is [today − weekDaysBefore, today + weekDaysAfter],
	 * inclusive; each side is 1–7 days. The view is still navigable past this
	 * default (arrows shift the window; "Today" snaps back to it).
	 */
	weekDaysBefore: number;
	weekDaysAfter: number;
	/**
	 * Week and Grid show as many days as fit their width (a day column has a
	 * minimum width), up to seven, instead of the span above (spec decision 139).
	 */
	fitDaysToWidth: boolean;

	/** Vault folder holding project files. */
	projectsFolder: string;
	/** Vault folder holding domain files. */
	domainsFolder: string;
	/** Vault path to the single global backlog file. */
	backlogPath: string;
	/** Vault path to the single routines file (recurring blocks and tasks). */
	routinesPath: string;

	/**
	 * The daily-note section heading Kairos reads and writes, given verbatim with
	 * its hashtags so the user controls both the title and the heading level
	 * (e.g. "## Schedule", "# My Day", "### Plan").
	 */
	scheduleHeading: string;

	/**
	 * Open the association picker right after a new timeline block is created, so
	 * a block is filed the moment it exists instead of being left unassociated.
	 * Off by default — creating a block is a fast, repeated gesture and a popup
	 * on every one gets in the way unless you asked for it.
	 */
	askAssocOnBlockCreate: boolean;
	/**
	 * The same prompt after a new backlog item is created, but only when the
	 * item's association isn't already implied. Creating inside a project or
	 * domain group answers the question by where you created it.
	 */
	askAssocOnBacklogCreate: boolean;

	/**
	 * Add the day's routines as soon as a new daily note is created. Off by
	 * default: routines are pulled in deliberately from the Grid (one at a time,
	 * or all at once from the date row) or with "Apply routines to this day".
	 */
	autoApplyRoutines: boolean;
	/**
	 * The Day and Week views follow the Grid: grabbing, adding or editing a task
	 * in the Grid shows that day in the Day view, and in the Week view when it's
	 * outside the window shown. Moving either view by hand still works; the next
	 * Grid action moves it again. (Selecting a Grid column header shows its day
	 * in the Day view whether or not this is on.)
	 */
	followGrid: boolean;
	/**
	 * Pointing at a block or task lights it up in every open view: the block as
	 * a whole, and the task itself on top (features/timeline/view-links.store.ts). On by default.
	 */
	highlightAcrossViews: boolean;
	/**
	 * The title of a block made by dropping a task on empty time in the Day or
	 * Week view. Empty: the task's project or domain name ("New block" without
	 * one).
	 */
	dropBlockTitle: string;

	/**
	 * Show a rolled-up task's project as a muted label at
	 * the end of its line on its domain's row (decision 74). Off by default.
	 */
	gridShowRollupProjects: boolean;

	/**
	 * Show each day's Unscheduled tasks in the Grid's cells, on their row. Off:
	 * they're behind the Unscheduled badge on the day's header instead, which
	 * pulses when a task typed in a cell lands in it. On by default.
	 */
	gridUnscheduledInCells: boolean;

	/**
	 * Draw a line under every Grid row, including between a domain and its
	 * projects, which otherwise read as one block. Off by default.
	 */
	gridRowLines: boolean;

	/** Tint every other Grid row, label and cells. Off by default. */
	gridRowShading: boolean;
}

/** Every control key is a settings property, so the default value resolver works. */
export type KairosSettingKey = Extract<keyof KairosSettings, string>;
