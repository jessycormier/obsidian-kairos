import type { TaskStatus } from "../../core/models/task.interface";

/** One scheduled block, reduced to what the tour compares. */
export interface BlockSummary {
	line: number;
	title: string;
	start: number;
	end: number;
	tasks: { text: string; status: TaskStatus }[];
}

/**
 * The block the tour is following: the one the person made in step 2. Persisted
 * with the tour state, so a restart mid-tour still knows which block it was.
 */
export interface TrackedBlock {
	date: string;
	line: number;
	title: string;
	/** The title it was made with, so a rename is anything else. */
	createdTitle: string;
	start: number;
	end: number;
}
