import type { Association } from "../../core/models/association.type";
import type { LifecycleState } from "../../core/models/project.interface";

/** One selectable row in the association picker. */
export interface AssociationOption {
	/** The association this row would apply. */
	association: Association;
	/** Canonical display name. */
	name: string;
	kind: "project" | "domain";
	/** Current lifecycle state (latest status record; defaults to active). */
	status: LifecycleState;
}
