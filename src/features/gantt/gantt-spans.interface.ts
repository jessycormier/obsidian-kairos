import type { LifecycleState } from "../../core/models/project.interface";
import type { ISODate } from "../../core/models/time.type";

export interface Span {
	start: ISODate;
	/** Exclusive-ish end used for rendering; the open last span ends at `today`. */
	end: ISODate;
	status: LifecycleState;
	note?: string;
	/** Why the entity moved into this state — copied from the record verbatim. */
	why?: string;
	/** True for the trailing, still-running span (no successor record). */
	open: boolean;
	/** The record's 0–5 intensity. Only set on an active span that has one. */
	intensity?: number;
}
