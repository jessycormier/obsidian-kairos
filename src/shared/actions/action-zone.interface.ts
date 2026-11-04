import type { ActionZoneAnchor } from "./action-zone-geometry.interface";

export interface ActionZoneOptions {
	/** Where the bar sits on the row (default "top-right"). */
	anchor?: ActionZoneAnchor;
	/** Share of the row's width the zone reaches along its widest line. */
	fraction?: number;
	/**
	 * "bar" (default): the bar's own CSS lays it out. "stack" (EXPERIMENT): a
	 * vertical stack, one button wide, whose first button by CSS `order` sits in
	 * the row's top-right corner and the rest rise above it (or hang below when
	 * there's no room above). Mouse wakes only; touch keeps the bar's CSS.
	 */
	layout?: "bar" | "stack";
	/**
	 * The row has a right-click menu. On touch, its selected bar gets a ⋯ that
	 * opens it (touch-select.action.ts).
	 */
	menu?: boolean;
}
