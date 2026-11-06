import type { Block } from "../models/block.interface";

/**
 * Persist a full set of blocks as the note's Schedule section.
 *
 * The blocks are re-serialized and spliced over the existing section, leaving
 * frontmatter, other headings, and surrounding prose untouched. If the note has
 * no Schedule section yet, one is appended.
 *
 * Ordering is normalized here (timed blocks by start time, untimed pinned to
 * the end) so callers never have to keep the array sorted themselves.
 */
export interface WriteResult {
  // The normalized block order actually written. A caller doing an optimistic
  // in-memory update should adopt this, not its pre-sort input, so memory and
  // disk stay identical (no correcting re-render).
  blocks: Block[];
  // The full new file text. A caller can cache this and compare it against the
  // `vault.on("modify")` echo of this very write, to skip reparsing its own
  // change while still reacting to genuinely external edits.
  text: string;
}

export interface CrossDayTaskMove {
  /** The source day's blocks, with the task removed from its owner. */
  from: Block[];
  /** The target day's blocks, with the task appended to Unscheduled. */
  to: Block[];
}

export interface CrossDayMove {
  /** The source day's blocks, with the moved block removed. */
  from: Block[];
  /** The target day's blocks, with the moved block inserted. */
  to: Block[];
}
