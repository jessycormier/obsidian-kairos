// Time primitives shared by every Kairos model.

export type Minutes = number; // minutes since midnight
export type ISODate = string; // YYYY-MM-DD

export interface TimeRange {
  start: Minutes;
  end: Minutes; // must be > start
}
