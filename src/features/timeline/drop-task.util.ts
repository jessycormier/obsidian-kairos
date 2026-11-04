// Commit a task drag that ended on a block (or empty time) of some day.
//
// The planner (features/timeline/task-drop.util.ts) is pure and needs both days' blocks; this is the
// thin view-side wrapper that reads them from the index, creates the target
// day's note when it has none yet, and commits the result. Every drop on a block
// goes through here, so they all write the same thing.

import type { KairosIndex } from "../../core/vault-index/kairos-index.service";
import type { Association } from "../../core/models/association.type";
import type { Block } from "../../core/models/block.interface";
import type { Task } from "../../core/models/task.interface";
import type { ISODate } from "../../core/models/time.type";
import { ensureNoteForDate } from "../../core/note/day-note.util";
import { commitTaskDrop, planTaskDrop } from "./task-drop.util";
import type { DayBlocks, DropModifiers, TimelineDrop } from "./task-drop.interface";

/** A day's blocks as the index holds them now, or null when it has no note. */
function indexedDay(index: KairosIndex, date: ISODate): DayBlocks | null {
	const day = index.snapshot().days.get(date);
	return day ? { date, path: day.path, blocks: day.blocks } : null;
}

/**
 * Drop `task` (sitting in `owner` on `fromDate`) on `drop`, re-filing it to
 * `assoc` when given (see `planTaskDrop`). Returns whether anything was written. The source is read after the target note is ensured,
 * so an await can't leave the plan working from stale blocks.
 */
export async function dropTaskOnTimeline(
	index: KairosIndex,
	fromDate: ISODate,
	owner: Block,
	task: Task,
	drop: TimelineDrop,
	mods: DropModifiers,
	assoc?: Association | null,
): Promise<boolean> {
	const target =
		indexedDay(index, drop.date) ?? {
			date: drop.date,
			path: await ensureNoteForDate(drop.date),
			blocks: [],
		};
	const source = fromDate === drop.date ? target : indexedDay(index, fromDate);
	if (!source) return false;
	const outcome = planTaskDrop({ day: source, owner, task }, target, drop, mods, assoc);
	if (!outcome) return false;
	commitTaskDrop(index, outcome);
	return true;
}

/**
 * Put a copy of `task` right after it in its block, keeping its own
 * association: the task menu's **Duplicate**, touch's stand-in for a
 * Ctrl/Cmd-drop (spec decision 129). The copy is then dragged where it goes.
 */
export function duplicateTask(
	index: KairosIndex,
	date: ISODate,
	owner: Block,
	task: Task,
): Promise<boolean> {
	const at = owner.tasks.findIndex((t) => t.source.line === task.source.line);
	return dropTaskOnTimeline(
		index,
		date,
		owner,
		task,
		{ kind: "block", date, blockLine: owner.source.line, index: at + 1 },
		{ duplicate: true },
		task.assoc ?? null,
	);
}
