/** Where the bar sits on the row, and so where the triangle is widest. */
export type ActionZoneAnchor = "top-right" | "right";

/** The parts of a DOMRect the geometry needs. */
export interface ZoneRect {
	top: number;
	right: number;
	width: number;
	height: number;
}
