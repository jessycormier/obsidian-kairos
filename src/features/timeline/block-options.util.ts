// Options for the block picker (the "nest task under block" combo box).
//
// A day's blocks presented as pickable rows, mirroring features/associations/association-options.util.ts:
// a pure projection from the domain (`Block[]`) to a flat, filterable list the
// picker renders without knowing about blocks. Shared so both the timeline (nest
// gesture) and, later, the grid can offer the same "move this task into a block"
// affordance from one source of truth.

import type { Block } from "../../core/models/block.interface";
import type { TimeRange } from "../../core/models/time.type";
import { formatTimeRange } from "../../core/note/note.parser";
import type { BlockOption } from "./block-options.interface";

function timeLabelOf(time: TimeRange | undefined): string | undefined {
  return time ? formatTimeRange(time) : undefined;
}

/**
 * Project a day's blocks into pickable options, sorted the way the timeline
 * shows them (timed by start, untimed pinned to the end). `exclude` drops a
 * block by source line — used to hide the task's current owner so "nest under
 * block" never offers a no-op move to where it already lives.
 */
export function blockOptions(
  blocks: Block[],
  exclude?: number,
): BlockOption[] {
  return blocks
    .filter((b) => b.source.line !== exclude)
    .map((b) => ({
      block: b,
      title: b.title,
      timeLabel: timeLabelOf(b.time),
      start: b.time ? b.time.start : Number.MAX_SAFE_INTEGER,
      untimed: b.time === undefined,
    }))
    .sort((a, b) => a.start - b.start);
}

/** Case-insensitive substring filter over titles (and time labels). */
export function filterBlockOptions(
  options: BlockOption[],
  query: string,
): BlockOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter(
    (o) =>
      o.title.toLowerCase().includes(q) ||
      (o.timeLabel?.toLowerCase().includes(q) ?? false),
  );
}
