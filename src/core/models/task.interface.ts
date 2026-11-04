import type { Association } from "./association.type";
import type { Block } from "./block.interface";
import type { SourceRef } from "./source-ref.interface";
import type { ISODate } from "./time.type";

export type TaskStatus = " " | "x" | "/" | "-"; // [ ] [x] [/] [-]

export interface Task {
  source: SourceRef;
  text: string;
  status: TaskStatus;
  assoc?: Association; // absent → inherits parent block's assoc
  metadata?: string; // freeform user data (priority stand-in, and anything else)
}

// A task with what the index derives about it.
export interface ResolvedTask extends Task {
  date: ISODate;
  block: Block; // a reference to the parent block
  owner?: Association; // assoc ?? block.assoc ?? none
  scheduled: boolean; // true iff inside a block that isn't Unscheduled
}
