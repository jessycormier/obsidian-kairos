import type { Block } from "../../core/models/block.interface";
import type { ResolvedTask, Task } from "../../core/models/task.interface";
import type { ISODate, TimeRange } from "../../core/models/time.type";
import type { TimelineDrop } from "./task-drop.interface";

/** A flat item surfaced from DayColumn to WeekView for unscheduled rendering. */
export interface UnscheduledItem {
  block: Block;
  task: ResolvedTask;
}

/** The task being dragged, plus the block it started in. */
export interface TaskDragState {
  owner: Block;
  task: Task;
  // Where to paint the floating ghost (follows the pointer).
  ghostX: number;
  ghostY: number;
  // A short label for the ghost — the task's text.
  label: string;
  // Ctrl/Cmd held → drop a copy instead of moving. Tracked live (set on grab,
  // refreshed on every move) so the user can decide mid-drag; read at drop.
  duplicate: boolean;
}

/** A block being dragged (grid block DnD). */
export interface BlockDragState {
  block: Block;
  /** The ISO date of the source day — used at drop time to find the source day. */
  sourceDate: string;
  /**
   * The Grid row it was lifted from. A header can show in a row that isn't the
   * block's own (decision 73); a drop back on that row keeps its association.
   */
  sourceRowKey?: string;
  // Where to paint the floating ghost.
  ghostX: number;
  ghostY: number;
  // Ghost label: block title + child count so the user knows what's carried.
  label: string;
  // Ctrl/Cmd held → drop a copy instead of moving (see TaskDragState).
  duplicate: boolean;
}

/** A block moving to another Week column, as the column it would land in draws it. */
export interface IncomingBlock {
  date: ISODate;
  label: string;
  time: TimeRange;
}

/** A resolved drop position: which block, and the insertion index within it. */
export interface DropSlot {
  blockLine: number;
  index: number;
}

/** A drop on a Grid block group: where it lands, and the row it's in. */
export interface GridGroupDrop {
  drop: TimelineDrop;
  rowKey: string;
}

/**
 * The DOM contract for grid cells, emitted by GridView:
 *   • the datacell wrapper carries `data-grid-date="<ISO date>"` and
 *     `data-grid-row-key="<row.key>"`,
 *   • each task row carries `data-task-index="<i>"`.
 */
export interface GridDropSlot {
  date: string;
  /** The row key — used by GridView to look up the row's association. */
  rowKey: string;
  /** Insertion index among the cell's tasks (clamped by the caller). */
  index: number;
}
