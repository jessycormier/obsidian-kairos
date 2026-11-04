import type { Association } from "../../core/models/association.type";
import type { ISODate } from "../../core/models/time.type";

/** Whether an owner is active on a date. */
export type OwnerActive = (assoc: Association, date: ISODate) => boolean;
