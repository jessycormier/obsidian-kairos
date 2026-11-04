import type { Block } from "../../core/models/block.interface";
import type { Minutes, TimeRange } from "../../core/models/time.type";
import type { TimelineGeometry } from "./timeline-layout.interface";

export type GestureMode = "move" | "resize-top" | "resize-bottom" | "create";

/**
 * The live result of a gesture at the current pointer offset.
 *
 * `ranges` maps each gripped block to its previewed range (for move/resize).
 * `draft` is the sketched range of a create gesture, or undefined until the
 * drag has covered at least one snap step.
 */
export interface GesturePreview {
	ranges: Map<Block, TimeRange>;
	draft?: TimeRange;
}

// One captured block's starting range, so a gesture is computed as a delta from
// where it began rather than from the (already moving) preview.
export interface Grip {
	block: Block;
	start: Minutes;
	end: Minutes;
}

export interface Gesture {
	mode: GestureMode;
	// Pointer offset (px from body top) where the gesture began.
	originOffset: number;
	// Blocks under manipulation with their ranges at gesture start. For `create`
	// this is empty and the draft is derived from origin + current instead.
	grips: Grip[];
	geo: TimelineGeometry;
}
