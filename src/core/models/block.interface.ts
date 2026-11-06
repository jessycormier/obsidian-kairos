import type { Association } from "./association.type";
import type { SourceRef } from "./source-ref.interface";
import type { Task } from "./task.interface";
import type { TimeRange } from "./time.type";

// A bullet without a checkbox nested under a block: a record of what happened
// in that time, not something to do (decision 96). Kept verbatim. `at` is how
// many of the block's tasks come before it, so a note is written back where
// it was. Notes are addressed by their index in `Block.notes`.
export interface Note {
  text: string;
  at: number;
}

// A block is a span of time: a title, an association, metadata, a time range,
// and the tasks and notes inside it. Time belongs to blocks and work belongs to
// tasks (spec §1), so a block has no status — it happens, or it is deleted. To
// track whether something timed got done, put a task inside the block.
export interface Block {
  source: SourceRef;
  title: string;
  assoc?: Association;
  metadata?: string; // freeform user data, same as a task's
  tasks: Task[];
  notes?: Note[]; // checkbox-less bullets under the block, in note order
  scheduled: boolean;
  time?: TimeRange;
}
