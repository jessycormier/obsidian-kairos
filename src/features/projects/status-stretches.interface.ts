import type { StatusRecord } from "../../core/models/project.interface";
import type { ISODate } from "../../core/models/time.type";

export interface Stretch {
	rec: StatusRecord;
	/** The record before, whose stretch this transition ends. Undefined for the first. */
	prev?: StatusRecord;
	start: ISODate;
	/** The next record's date (exclusive), or undefined while it runs on. */
	end?: ISODate;
	/** The stretch in effect today. */
	current: boolean;
	/** Starts after today. */
	future: boolean;
	/** Its length in days: to its end, or to today while it runs on. */
	days: number;
}

/** One stretch's place on the strip, as fractions of its width. */
export interface StripPart {
	stretch: Stretch;
	left: number;
	width: number;
}
