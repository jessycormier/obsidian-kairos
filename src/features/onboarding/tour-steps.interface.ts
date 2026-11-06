import type { BlockSummary, TrackedBlock } from "./tour-progress.interface";

export type StepId =
	| "open-day"
	| "make-block"
	| "rename"
	| "add-task"
	| "check"
	| "open-note"
	| "finish";

/** What a step's popover points at. */
export type AnchorKind =
	| "ribbon"
	| "day-canvas"
	| "block-title"
	| "block-corner"
	| "task-checkbox"
	| "day-date"
	| "none";

export interface TourStep {
	id: StepId;
	title: string;
	body: string;
	/** The copy on a phone or tablet, where there's no hover or right-click. */
	bodyMobile?: string;
	anchor: AnchorKind;
}

/** What the tour knows about the person's progress right now. */
export interface StepContext {
	/** A Day view is open. */
	dayOpen: boolean;
	/** The block made in "make-block", once there is one. */
	tracked?: TrackedBlock;
	/** The tracked block as the index has it now, when it can be found. */
	current?: BlockSummary;
	/** The tracked block as it was when the current step began. */
	atStepStart?: BlockSummary;
	/** The tracked block's note was opened during this step. */
	noteOpened: boolean;
}
