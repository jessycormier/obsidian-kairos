// Pure index state: which kind of file a path is, and the reparse/remove steps
// that build an `IndexState` from the vault's files. Each returns a NEW state
// (never mutates its input), so tests need no vault. `KairosIndex`
// (kairos-index.service.ts) holds the live state and drives these.

import { getDateFromPath } from "obsidian-daily-notes-interface";
import { domainProjects } from "../../features/associations/association.util";
import { parseBacklog } from "../../features/backlog/backlog.file";
import { parseDomain, parseProject } from "../../features/projects/project.file";
import type { Day } from "../models/day.interface";
import type { Project } from "../models/project.interface";
import type { SourceRef } from "../models/source-ref.interface";
import type { ResolvedTask } from "../models/task.interface";
import type { ISODate } from "../models/time.type";
import { parseSchedule } from "../note/note.parser";
import { DEFAULT_HEADING } from "../note/schedule-section.util";
import { resolveBlocks } from "../note/task-resolver.util";
import type { FileKind, IndexPaths, IndexState } from "./vault-index.interface";

// ─── file routing ──────────────────────────────────────────────

/** Is `path` the folder itself or something beneath it? */
function isUnder(path: string, folder: string): boolean {
	return folder !== "" && (path === folder || path.startsWith(folder + "/"));
}

/**
 * Route a path to the kind of file it is. Daily-note detection defers to the
 * Daily Notes plugin's own folder + format config (via `getDateFromPath`); the
 * rest route by Kairos's own settings. Called fresh per event so a just-created
 * or renamed note resolves against the current config, not a stale snapshot.
 */
export function classify(path: string, settings: IndexPaths): FileKind {
	const m = getDateFromPath(path, "day");
	if (m) return { kind: "day", date: m.format("YYYY-MM-DD") };
	if (path === settings.backlogPath) return { kind: "backlog" };
	if (isUnder(path, settings.projectsFolder)) return { kind: "project" };
	if (isUnder(path, settings.domainsFolder)) return { kind: "domain" };
	return { kind: "ignore" };
}

// ─── pure state ────────────────────────────────────────────────

export function emptyState(): IndexState {
	return {
		days: new Map(),
		projects: new Map(),
		domains: new Map(),
		backlog: [],
		byProject: new Map(),
		byDomain: new Map(),
		byDomainProjects: new Map(),
	};
}

/**
 * Recompute byProject / byDomain from every resolved task across all days. Runs
 * after any change to the day/project/domain maps.
 *
 * Buckets by an association's `id`. Alias resolution (old name → current
 * project) is not done yet — it needs the project/domain maps, which is your
 * half. The seam is `ownerKey`; extend it to canonicalize once aliases exist.
 */
export function deriveLookups(state: IndexState): IndexState {
	const byProject = new Map<string, ResolvedTask[]>();
	const byDomain = new Map<string, ResolvedTask[]>();

	for (const day of state.days.values()) {
		for (const task of resolveBlocks(day.blocks, day.date)) {
			const owner = task.owner;
			if (!owner) continue;
			const bucket = owner.kind === "project" ? byProject : byDomain;
			const key = ownerKey(owner.id);
			const list = bucket.get(key);
			if (list) list.push(task);
			else bucket.set(key, [task]);
		}
	}

	// Child projects per domain (by the domain's stable id), for the Grid view's
	// expand-domains toggle. Cheap to recompute alongside the task rollups since
	// both run on any project/domain/day change.
	const byDomainProjects = new Map<string, Project[]>();
	for (const domain of state.domains.values()) {
		byDomainProjects.set(domain.id, domainProjects(domain.id, state.projects));
	}

	return { ...state, byProject, byDomain, byDomainProjects };
}

/** Canonicalize an association id. TODO: fold in alias → current-name mapping. */
function ownerKey(id: string): string {
	return id;
}

/**
 * Reparse one daily note into the state. Pure: `mtime` is passed in rather than
 * looked up, so tests need no vault. Returns a NEW state (never mutates input).
 */
export function reindexDay(
	state: IndexState,
	path: string,
	date: ISODate,
	content: string,
	mtime: number,
	heading: string = DEFAULT_HEADING,
): IndexState {
	const day: Day = {
		date,
		path,
		mtime,
		blocks: parseSchedule(content, path, heading),
	};
	const days = new Map(state.days);
	days.set(date, day);
	return deriveLookups({ ...state, days });
}

/** Drop a day from the state (its file was deleted). */
export function removeDay(state: IndexState, date: ISODate): IndexState {
	if (!state.days.has(date)) return state;
	const days = new Map(state.days);
	days.delete(date);
	return deriveLookups({ ...state, days });
}

/**
 * Reparse a project file into the state, keyed by the project's name (since
 * associations match by name). A file that no longer parses as a project (tag
 * removed) drops any prior entry at `path`.
 */
export function reindexProject(
	state: IndexState,
	path: string,
	content: string,
): IndexState {
	const projects = new Map(state.projects);
	dropByPath(projects, path);
	const project = parseProject(content, path);
	if (project) projects.set(project.name, project);
	return deriveLookups({ ...state, projects });
}

/** Reparse a domain file into the state, keyed by the domain's name. */
export function reindexDomain(
	state: IndexState,
	path: string,
	content: string,
): IndexState {
	const domains = new Map(state.domains);
	dropByPath(domains, path);
	const domain = parseDomain(content, path);
	if (domain) domains.set(domain.name, domain);
	return deriveLookups({ ...state, domains });
}

/** Remove whatever project/domain a deleted file provided. */
export function removeProjectFile(state: IndexState, path: string): IndexState {
	const projects = new Map(state.projects);
	if (!dropByPath(projects, path)) return state;
	return deriveLookups({ ...state, projects });
}

export function removeDomainFile(state: IndexState, path: string): IndexState {
	const domains = new Map(state.domains);
	if (!dropByPath(domains, path)) return state;
	return deriveLookups({ ...state, domains });
}

/**
 * Reparse the global backlog file into the state. The backlog is a single flat
 * file (spec §2.6), so — unlike days/projects/domains — reindexing replaces the
 * whole list rather than one keyed entry. Backlog entries are not tasks and
 * feed no rollup, so `deriveLookups` need not rerun; the caller republishes the
 * backlog store directly.
 */
export function reindexBacklog(
	state: IndexState,
	path: string,
	content: string,
): IndexState {
	return { ...state, backlog: parseBacklog(content, path) };
}

/** Drop the backlog (its file was deleted): an empty list. */
export function removeBacklog(state: IndexState): IndexState {
	return { ...state, backlog: [] };
}

/**
 * Remove any entry sourced from `path`. Needed because these maps are keyed by
 * name, not path: a rename or a name change means the old key must be found via
 * its source. Returns whether anything was removed.
 */
function dropByPath(
	map: Map<string, { source: SourceRef }>,
	path: string,
): boolean {
	for (const [key, value] of map) {
		if (value.source.path === path) {
			map.delete(key);
			return true;
		}
	}
	return false;
}
