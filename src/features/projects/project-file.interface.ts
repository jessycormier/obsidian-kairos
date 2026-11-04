import type { LifecycleState } from "../../core/models/project.interface";
import type { ISODate } from "../../core/models/time.type";

/** The replacement `editStatusRecord` takes; see there for which keys preserve. */
export interface StatusEdit {
	date: ISODate;
	status: LifecycleState;
	note?: string;
	why?: string;
	intensity?: number;
}
