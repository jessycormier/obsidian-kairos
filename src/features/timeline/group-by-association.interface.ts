import type { Association } from "../../core/models/association.type";
import type { ResolvedAssociation } from "../associations/resolved-association.interface";

export interface AssocGroup<T> {
	/** Stable key: the resolved note path, else kind + raw id; "" for none. */
	key: string;
	/** Undefined for the trailing group of items with no association. */
	assoc?: Association;
	resolved?: ResolvedAssociation;
	items: T[];
}
