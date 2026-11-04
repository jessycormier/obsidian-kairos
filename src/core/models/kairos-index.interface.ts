import type { BacklogEntry } from "./backlog-entry.interface";
import type { Day } from "./day.interface";
import type { Domain } from "./domain.interface";
import type { Project } from "./project.interface";
import type { ResolvedTask } from "./task.interface";
import type { ISODate } from "./time.type";

// The index's read shape: everything every view derives from.
export interface Index {
  days: Map<ISODate, Day>;
  projects: Map<string, Project>;
  domains: Map<string, Domain>;
  backlog: BacklogEntry[];

  byProject: Map<string, ResolvedTask[]>;
  byDomain: Map<string, ResolvedTask[]>;
  // Child projects of each domain, keyed by the domain's stable id (a project
  // links to its domain by id, not name). Feeds the Grid view's expand-domains
  // toggle. Excludes archived projects.
  byDomainProjects: Map<string, Project[]>;
}
