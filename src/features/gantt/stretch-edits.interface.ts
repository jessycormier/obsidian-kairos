import type { ISODate } from "../../core/models/time.type";

/** Which date a gesture changes: the opener's, the (exclusive) end, or the
 *  whole stretch, given as its new start. */
export type StretchEditKind = "start" | "end" | "move";

export interface Bounds {
	min: ISODate | null;
	max: ISODate | null;
}
