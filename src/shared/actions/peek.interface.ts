export interface PeekOptions {
	/** The full text to show. Defaults to the node's text content. */
	text?: string;
	/** An optional muted second line (e.g. a date range). */
	detail?: string;
	/** The element whose overflow decides whether to open. Defaults to the node. */
	measure?: () => HTMLElement | undefined | null;
	/** Open even when nothing is truncated (for cards that carry a `detail`). */
	always?: boolean;
	/** Handle the touch hold-and-release gesture here. Default true. */
	touch?: boolean;
	/** Hover / hold time before the card opens, in ms. */
	delay?: number;
}
