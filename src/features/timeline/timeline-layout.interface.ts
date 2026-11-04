import type { Block } from "../../core/models/block.interface";

export interface TimelineGeometry {
	startHour: number; // first hour shown in the gutter
	endHour: number; // last hour shown (exclusive of its label row)
	hourHeight: number; // pixels per hour
	topPad: number; // padding above the first hour line
}

/** A block's placement rectangle in the timeline body. */
export interface Placement {
	block: Block;
	top: number;
	height: number;
	column: number; // horizontal lane for overlap handling
	lanes: number; // total lanes in this block's overlap cluster
}
