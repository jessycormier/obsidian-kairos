export interface FloatRect {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface PlaceOptions {
	/** Gap between the anchor and the panel, and the min viewport margin. */
	margin?: number;
	/** Panel width; used to clamp the left edge. */
	width: number;
	/** Panel height; used to decide whether to flip above the anchor. */
	height: number;
}
