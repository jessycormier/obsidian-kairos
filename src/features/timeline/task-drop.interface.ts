import type { Block } from "../../core/models/block.interface";
import type { Task } from "../../core/models/task.interface";
import type { ISODate, TimeRange } from "../../core/models/time.type";

/** A drop position on a timeline, found by hit-testing its DOM. */
export type TimelineDrop =
	| { kind: "block"; date: ISODate; blockLine: number; index: number }
	| { kind: "unscheduled"; date: ISODate }
	| { kind: "time"; date: ISODate; time: TimeRange };

/** One day as the planner sees it. `path` is where its note lives (or will). */
export interface DayBlocks {
	date: ISODate;
	path: string;
	blocks: Block[];
}

/** The dragged task and the block it currently sits in, on `day`. */
export interface DragSource {
	day: DayBlocks;
	owner: Block;
	task: Task;
}

/** Modifier state at release. */
export interface DropModifiers {
	duplicate: boolean;
	/**
	 * The title a block made by a drop on empty time gets (a setting). Empty or
	 * absent: the task's project or domain name.
	 */
	blockTitle?: string;
}

/** What to commit: one day rewritten, or a task moved between two days. */
export type DropOutcome =
	| { kind: "day"; day: DayBlocks }
	| { kind: "cross"; from: DayBlocks; to: DayBlocks };

/** The commit side the index offers; narrowed so the planner's callers can share one. */
export interface DropCommitter {
	applyDayEdit(date: ISODate, path: string, blocks: Block[]): void;
	applyCrossDayMove(
		fromDate: ISODate,
		fromPath: string,
		fromBlocks: Block[],
		toDate: ISODate,
		toPath: string,
		toBlocks: Block[],
	): void;
}
