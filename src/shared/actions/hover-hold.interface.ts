export interface HoverHoldOptions {
	onopen: () => void;
	onclose: () => void;
	/** Hover / hold time before the card opens, in ms. */
	delay?: number;
}
