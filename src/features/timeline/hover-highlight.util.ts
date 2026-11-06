import type { Block } from "../../core/models/block.interface";
import type { Task } from "../../core/models/task.interface";
import type { Highlight, HoverTarget } from "./view-links.interface";

// ── The one highlight rule, shared by every view ──
//
// Two levels. Pointing at anything in a block lights the *block*: its header
// and every task in it in the Grid, the block itself in the timelines. Pointing
// at a task also marks *that task*, wherever it shows. The item under the
// pointer lights up like the rest, so a group reads as one.

export function hoverBlockTarget(block: Block): HoverTarget {
	const { path, line } = block.source;
	return { kind: "block", path, line, block: line };
}

export function hoverTaskTarget(task: Task, owner: Block): HoverTarget {
	const { path, line } = task.source;
	return owner.time
		? { kind: "task", path, line, block: owner.source.line }
		: { kind: "task", path, line };
}

/** Whether the hover lights `block` as a whole. */
export function blockLit(hover: HoverTarget | null, block: Block): boolean {
	return (
		!!hover &&
		hover.block !== undefined &&
		hover.path === block.source.path &&
		hover.block === block.source.line
	);
}

/** How `task`, sitting in `owner`, is lit by the hover. */
export function taskHighlight(
	hover: HoverTarget | null,
	task: Task,
	owner: Block,
): Highlight {
	if (!hover) return null;
	if (
		hover.kind === "task" &&
		hover.path === task.source.path &&
		hover.line === task.source.line
	) {
		return "task";
	}
	return blockLit(hover, owner) ? "block" : null;
}
