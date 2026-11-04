import type { Block } from "../../core/models/block.interface";
import type { ResolvedTask } from "../../core/models/task.interface";
import type { ISODate } from "../../core/models/time.type";
import type { RowLabelInfo } from "../../shared/components/row-label.interface";

/** A stable key identifying a row (used for keyed rendering and cell lookup). */
export type RowKey = string;

export type GridRow =
	| {
			kind: "project";
			key: RowKey;
			name: string;
			color?: string;
			/** Indent depth: 0 top-level, 1 child under a domain. */
			depth: number;
			/** Presentation for the row-label column + its hover card. */
			info: RowLabelInfo;
	  }
	| {
			kind: "domain";
			key: RowKey;
			name: string;
			domainId: string;
			color?: string;
			depth: 0;
			info: RowLabelInfo;
	  }
	| { kind: "unassigned"; key: RowKey; name: string; depth: 0 };

/** The association a create-in-cell should apply for a row (undefined = none). */
export type RowAssociation =
	| { kind: "project"; id: string }
	| { kind: "domain"; id: string }
	| undefined;

/** A rolled-up project's tasks within a domain row's cell, under its header. */
export interface CellGroup {
	/** The project's canonical name — the header text. */
	name: string;
	tasks: ResolvedTask[];
}

/**
 * One block's slice of a cell: the block's tasks that render on this row. A
 * block with none here still has a group in its own row, with no tasks.
 */
export interface BlockGroup {
	/** Stable key for keyed rendering: the block's note path and line. */
	key: string;
	block: Block;
	/** The block's tasks on this row, in note order. */
	tasks: ResolvedTask[];
}

/** A Grid block group, as a drop names it: its block's line, or Unscheduled. */
export type GroupKey = number | "unscheduled";

/** What a Grid task drag is over: a block group, or a cell outside any group. */
export type GridDropOver =
	| { kind: "group"; date: ISODate; group: GroupKey; sameRow: boolean }
	| { kind: "cell"; date: ISODate };

/** The task a Grid drag holds, as far as where it lands is concerned. */
export interface GridDragFrom {
	date: ISODate;
	/** The group it sits in now. */
	group: GroupKey;
	/** Ctrl/Cmd held: a copy lands, and the task stays where it is. */
	duplicate: boolean;
}
