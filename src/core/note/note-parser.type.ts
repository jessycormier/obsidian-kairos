import type { TimeRange } from "../models/time.type";

// What parseTimeRangeText hands back: the range, or a short error to show.
export type TimeRangeText =
  | { ok: true; range: TimeRange }
  | { ok: false; error: string };
