import type { Block } from "./block.interface";
import type { ISODate } from "./time.type";

// A daily note, parsed.
export interface Day {
  date: ISODate;
  path: string;
  mtime: number;
  blocks: Block[];
}
