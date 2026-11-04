import type { SourceRef } from "./source-ref.interface";
import type { ISODate } from "./time.type";

export type LifecycleState = "active" | "inactive" | "archived";

export interface StatusRecord {
  date: ISODate; // the day the change was recorded, not an effective-from date
  status: LifecycleState;
  // The intention for the entity over this stretch: what you mean to do with it
  // for now ("get it done this week", "occasional background work"). An open
  // label, never logic and never a keyword vocabulary — parsed and serialized
  // verbatim, and meaningful on any status, not just `active`. A changed
  // intention is reason enough for a new record even when the status holds.
  note?: string;
  // How hard the entity is being pushed over this stretch, an integer 0–5. The
  // explicit replacement for the old note keywords (#29): 0 is active with no
  // time going in, 5 is all-in. Absent means no claim. Only drawn on `active`
  // spans, but kept verbatim on any record.
  intensity?: number;
  // What moved the entity into this state ("stepped down after the handoff").
  // Distinct from `note`, which says what the state entails, and from a
  // project's `description`, which says what the project entails generally.
  why?: string;
}

// A `status:` entry Kairos would not itself have written, noted on parse. Two
// kinds are fixable and already became records — the flat scalar
// (`2026-08-04: active`) and a near-miss key that pads to a free date
// (`2026-8-4`) — so the next write emits them canonically. The other two can't
// become records at all: a state outside the lifecycle vocabulary (`draft`) and
// a key that isn't a usable date. Those are kept verbatim (`raw`) and re-emitted
// on every write, so no edit deletes what the user typed, but they never drive
// derived state.
export type StatusAnomalyKind =
  | "bare-string" // fixable: `2026-08-04: active`, not the object form
  | "padded-date" // fixable: `2026-8-4`, pads to a free YYYY-MM-DD
  | "unknown-state" // kept: a status outside active/inactive/archived
  | "bad-date"; // kept: a key that isn't (or can't safely become) YYYY-MM-DD

export interface StatusAnomaly {
  kind: StatusAnomalyKind;
  key: string; // the frontmatter key exactly as written
  raw: unknown; // the value exactly as written — re-emitted verbatim when kept
}

export interface Project {
  id: string;
  name: string;
  aliases: string[];
  description: string; // free-text blurb, shown inline on the projects page
  domain?: string; // at most one, by name
  // `rollup: true` in frontmatter: the project is "not worth its own row" — in
  // the Grid its tasks render on its domain's row, grouped under a header (#11).
  // Absent means false; only meaningful when `domain` is set. Kept optional so a
  // project that never had the flag never grows a `rollup: false` key.
  rollup?: boolean;
  history: StatusRecord[];
  // Non-canonical `status:` entries found on parse. Absent when the file is
  // clean, so a parsed entity only carries the key when there is something to
  // fix or preserve.
  anomalies?: StatusAnomaly[];
  archived: boolean;
  source: SourceRef; // project file / folder note
}
