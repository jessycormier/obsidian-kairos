import type { Domain } from "../../core/models/domain.interface";
import type { Project } from "../../core/models/project.interface";

/** The feed, filtered to the rows worth drawing for the current viewport. */
export interface VisibleEntities {
	/** Domains that earn a header, each with its visible child projects. */
	domains: { domain: Domain; projects: Project[] }[];
	/** Visible projects filed under no domain. */
	orphans: Project[];
}
