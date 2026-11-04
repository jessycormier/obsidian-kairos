/** A screen rectangle (client coordinates). */
export interface Box {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export type StackDirection = "up" | "down";

export interface StackPlacement {
	/** Client-coordinate left/top of the stack's border box. */
	left: number;
	top: number;
	direction: StackDirection;
}

/** How far in from the row's top-right corner the horizontal bar sat. */
export interface StackInset {
	top: number;
	right: number;
}

/** The computed-style properties the checks below read. */
export type StyleLike = Pick<
	CSSStyleDeclaration,
	| "transform"
	| "filter"
	| "perspective"
	| "contain"
	| "willChange"
	| "containerType"
	| "overflowX"
	| "overflowY"
> & { backdropFilter?: string };
