import type { ResolvedAssociation } from "../../features/associations/resolved-association.interface";
import type { Association } from "../models/association.type";
import type { Block } from "../models/block.interface";
import type { Domain } from "../models/domain.interface";
import type { Index } from "../models/kairos-index.interface";
import type { Project } from "../models/project.interface";
import type { ResolvedTask } from "../models/task.interface";
import type { ISODate } from "../models/time.type";

/** A snapshot-time association resolver, handed to views for rendering. */
export type Resolver = (assoc: Association) => ResolvedAssociation;

/** Folders/paths that route non-day files, plus the schedule-section heading. */
export interface IndexPaths {
	projectsFolder: string;
	domainsFolder: string;
	backlogPath: string;
	/** The daily-note section heading Kairos reads/writes, e.g. "## Schedule". */
	scheduleHeading: string;
}

export type FileKind =
	| { kind: "day"; date: ISODate }
	| { kind: "project" }
	| { kind: "domain" }
	| { kind: "backlog" }
	| { kind: "ignore" };

/** The engine's internal mutable form; `Index` (core/models/kairos-index.interface.ts) is the read shape. */
export type IndexState = Index;

/** What the live index needs from the outside world beyond file routing. */
export interface IndexDeps {
	read(path: string): Promise<string>;
	write(path: string, content: string): Promise<void>;
	/** Rename/move a file. Project/domain names ARE filenames, so a rename is a
	 *  file move, not a content edit — this is the write path a rename takes. */
	rename(oldPath: string, newPath: string): Promise<void>;
	/** Delete a file. Used when the user deletes a project/domain outright
	 *  (spec §4.4 — allowed, with a dangling-reference warning owned by the UI). */
	remove(path: string): Promise<void>;
	now(): number;
	settings: IndexPaths;
	writeDebounceMs: number;
	/** Run `fn` after `ms`; returns a canceller. Injected so the engine stays free of
	 *  `window` (it runs under plain Node in tests) yet popout-window safe in Obsidian. */
	schedule(fn: () => void, ms: number): () => void;
}

/**
 * What the Projects & Domains page renders: domains as durable top-level rows
 * (ordered), each with its child projects, plus the projects that belong to no
 * domain. Everything is derived from the current project/domain maps and
 * re-emitted whenever they change (spec §5, §6 project page).
 */
export interface ProjectsDomains {
	domains: Domain[];
	projectsByDomain: Map<string, Project[]>;
	orphans: Project[];
}

/** What a project-page store yields: the project plus its resolved tasks. */
export interface ProjectView {
	project: Project;
	tasks: ResolvedTask[];
}

/** What a domain store yields: the domain plus its resolved tasks. */
export interface DomainView {
	domain: Domain;
	tasks: ResolvedTask[];
}

/**
 * One visible day in the Grid view: the calendar date, the note path (null when
 * no note exists yet — a cell edit creates it), the day's raw blocks (the write
 * surface a cell edit rebuilds), and its resolved tasks (what a cell renders).
 */
export interface GridDay {
	date: ISODate;
	path: string | null;
	blocks: Block[];
	tasks: ResolvedTask[];
}

/**
 * Everything the Grid view needs, recomputed reactively. `days` carries the
 * visible columns; `projects`/`domains`/`byDomainProjects` carry the row axis
 * (and the expand-domains children). A live resolver is bundled so cells tint
 * without a second subscription.
 */
export interface GridSnapshot {
	days: GridDay[];
	projects: Map<string, Project>;
	domains: Map<string, Domain>;
	byDomainProjects: Map<string, Project[]>;
	resolve: Resolver;
}
