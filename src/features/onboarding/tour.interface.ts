import type { TrackedBlock } from "./tour-progress.interface";

/**
 * - `unseen`: a new install; the welcome opens with the first Kairos view.
 * - `announce`: an existing install from before the tour; it gets one notice.
 * - `active`: mid-tour, at `step`.
 * - `done` / `dismissed`: finished or declined; only the command starts it.
 */
export interface TourState {
	status: "unseen" | "announce" | "active" | "done" | "dismissed";
	step: number;
	block?: TrackedBlock;
}
