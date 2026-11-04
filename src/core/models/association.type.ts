// What a task, block or backlog entry is filed under.
export type Association =
  | { kind: "project"; id: string } // [Project]
  | { kind: "domain"; id: string }; // [D:Domain]
