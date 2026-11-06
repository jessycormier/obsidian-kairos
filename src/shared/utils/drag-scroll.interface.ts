export interface DragScroll {
	/** The pointer moved: remember where, for the edge check and re-hit-tests. */
	update(event: PointerEvent): void;
	/** The drag ended: stop scrolling and stop listening. */
	stop(): void;
}
