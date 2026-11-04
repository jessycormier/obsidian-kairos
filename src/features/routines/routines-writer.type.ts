import type { Association } from "../../core/models/association.type";
import type { TimeRange } from "../../core/models/time.type";
import type { Rule } from "./recurrence-rules.type";

/** A routine as the writer takes it: everything but where it lives. */
export type RoutineDraft =
	| {
			kind: "block";
			rule: Rule;
			title: string;
			time: TimeRange;
			assoc?: Association;
			metadata?: string;
	  }
	| {
			kind: "task";
			rule: Rule;
			text: string;
			/** Written on the task line itself. */
			assoc?: Association;
			metadata?: string;
			/** The block it belongs in; absent → the day's Unscheduled list. */
			home?: string;
			/** Written on a home line this edit has to create (inherited by the task). */
			homeAssoc?: Association;
	  };
