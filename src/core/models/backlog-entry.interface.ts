import type { Association } from "./association.type";
import type { SourceRef } from "./source-ref.interface";
import type { ISODate } from "./time.type";

// Single global flat file. Entries are not tasks; cannot be checked.
export interface BacklogEntry {
  source: SourceRef;
  text: string;
  assoc?: Association; // project, domain, or none
  resurface?: ISODate; // snooze / visibility date
}
