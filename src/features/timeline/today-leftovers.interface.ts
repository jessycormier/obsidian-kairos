import type { Day } from "../../core/models/day.interface";
import type { ISODate } from "../../core/models/time.type";
import type { Leftover } from "../routines/carry-over.interface";

export interface TodayLeftovers {
	today: ISODate;
	from: Day;
	items: Leftover[];
}
