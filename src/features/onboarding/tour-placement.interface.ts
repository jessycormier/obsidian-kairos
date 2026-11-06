export interface Rect {
	left: number;
	top: number;
	width: number;
	height: number;
}

export type Side = "left" | "right" | "below" | "above" | "corner";

export interface Placement {
	left: number;
	top: number;
	side: Side;
}
