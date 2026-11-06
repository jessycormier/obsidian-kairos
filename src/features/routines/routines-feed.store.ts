// The routines feed — one plugin-level source of routines for every view.
//
// Views subscribe here instead of each reading the routines file:
//   • `routines$` yields the parsed routines file, straight from the
//     RoutinesStore (which owns reading, watching and writing the file).
//   • `marks$` yields a lookup from a date to the `kairos-routines` hash its
//     daily note records, or undefined. It republishes (debounced) whenever a
//     daily note's metadata changes or a note is deleted, so a view re-derives
//     its routine previews the moment a day is set up.
//   • `active$` yields whether a routine's project or domain is active on a
//     date (routine-owners.util.ts), fresh whenever the project/domain files change, so a
//     paused routine drops out of every view as soon as its owner goes inactive.
//   • `carried$` yields the `kairos-carried` value a date's note records, the
//     day whose leftovers were dealt with, republished like `marks$`, so the
//     Day view's leftovers list goes away once you leave the rest.
// Obsidian glue only; the decisions live in routine-preview.util.ts and day-prep-plan.util.ts.

import { TFile, moment } from "obsidian";
import type { TAbstractFile } from "obsidian";
import { derived, writable } from "svelte/store";
import type { Readable } from "svelte/store";
import { getAllDailyNotes, getDailyNote, getDateFromPath } from "obsidian-daily-notes-interface";
import type Kairos from "../../main";
import type { ISODate } from "../../core/models/time.type";
import { ROUTINES_KEY } from "./apply-routines.util";
import { CARRIED_KEY } from "./carry-over.util";
import { ownerActive } from "./routine-owners.util";
import type { OwnerActive } from "./routine-owners.type";
import type { ParsedRoutines } from "./routines-file.interface";
import type { RoutinesStore } from "./routines.store";
import type { LeftoverActions, RoutineActions, RoutineMarks } from "./routines-feed.interface";

const DEBOUNCE_MS = 250;

export class RoutinesFeed {
	private marksStore = writable<RoutineMarks>(() => undefined);
	private carriedStore = writable<RoutineMarks>(() => undefined);
	private marksTimer: number | undefined;

	/** The parsed routines file — the RoutinesStore's copy, shared, not re-read. */
	readonly routines$: Readable<ParsedRoutines>;
	readonly marks$: Readable<RoutineMarks> = { subscribe: this.marksStore.subscribe };
	readonly carried$: Readable<RoutineMarks> = { subscribe: this.carriedStore.subscribe };
	readonly active$: Readable<OwnerActive>;

	constructor(
		private plugin: Kairos,
		routines: RoutinesStore,
	) {
		this.routines$ = routines.parsed$;
		// The index's resolver store republishes whenever a project or domain
		// changes, which is exactly when owner status can change.
		const index = plugin.indexAdapter.index;
		this.active$ = derived(index.resolver(), () => {
			const { projects, domains } = index.snapshot();
			return ownerActive(projects, domains);
		});
	}

	/** The routines alert's data and actions, for a view's props. */
	actions(): RoutineActions {
		const preparer = () => this.plugin.dayPreparer;
		return {
			routines$: this.routines$,
			marks$: this.marks$,
			active$: this.active$,
			insert: (date, routines) => void preparer().insertRoutines(date, routines),
			addAll: (date) => void preparer().applyToDate(date),
			regenerate: (date) => void preparer().regenerate(date),
		};
	}

	/** The Day view's leftovers data and actions, for its props. */
	leftoverActions(): LeftoverActions {
		const preparer = () => this.plugin.dayPreparer;
		return {
			carried$: this.carried$,
			bring: (date, from, which) => void preparer().bringLeftovers(date, from, which),
			leave: (date, from) => void preparer().leaveLeftovers(date, from),
		};
	}

	/** Subscribe to daily-note metadata events. Call when the layout is ready. */
	start(): void {
		const { app } = this.plugin;
		this.plugin.register(() => {
			if (this.marksTimer !== undefined) window.clearTimeout(this.marksTimer);
		});
		this.plugin.registerEvent(
			app.vault.on("delete", (f) => {
				if (isDailyNote(f)) this.scheduleMarks();
			}),
		);
		this.plugin.registerEvent(
			app.metadataCache.on("changed", (file) => {
				if (isDailyNote(file)) this.scheduleMarks();
			}),
		);
		this.publishMarks();
	}

	private scheduleMarks(): void {
		if (this.marksTimer !== undefined) window.clearTimeout(this.marksTimer);
		this.marksTimer = window.setTimeout(() => {
			this.marksTimer = undefined;
			this.publishMarks();
		}, DEBOUNCE_MS);
	}

	/** Publish a fresh lookup, so subscribers re-derive. Reads lazily per date. */
	private publishMarks(): void {
		const { metadataCache } = this.plugin.app;
		// Each published lookup scans the daily notes at most once, and answers
		// each date at most once, however often a view re-renders.
		let all: ReturnType<typeof getAllDailyNotes> | undefined;
		const read = (date: ISODate, key: string): string | undefined => {
			let note: TFile | null = null;
			try {
				all ??= getAllDailyNotes();
				note = getDailyNote(moment(date, "YYYY-MM-DD"), all);
			} catch {
				return undefined;
			}
			if (!note) return undefined;
			const value: unknown = metadataCache.getFileCache(note)?.frontmatter?.[key];
			if (typeof value === "string") return value;
			if (typeof value === "number") return String(value);
			return undefined;
		};
		const lookup = (key: string): RoutineMarks => {
			const memo = new Map<ISODate, string | undefined>();
			return (date) => {
				if (!memo.has(date)) memo.set(date, read(date, key));
				return memo.get(date);
			};
		};
		this.marksStore.set(lookup(ROUTINES_KEY));
		this.carriedStore.set(lookup(CARRIED_KEY));
	}
}

function isDailyNote(file: TAbstractFile): boolean {
	return file instanceof TFile && file.extension === "md" && getDateFromPath(file.path, "day") !== null;
}
