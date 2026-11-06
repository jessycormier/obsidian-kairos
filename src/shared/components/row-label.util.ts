// The presentation-facing shape of a Grid/Gantt row label, plus the pure
// derivation from an entity's history. Both the Grid and the Gantt sidebar
// render row labels the same way (name + status note + tinted domain icon +
// a hover popover); this keeps that shape and its derivation in one place.

import type { Domain } from "../../core/models/domain.interface";
import type { Project } from "../../core/models/project.interface";
import type { ISODate } from "../../core/models/time.type";
import { effectiveRecord } from "../../features/projects/project.file";
import type { RowLabelInfo } from "./row-label.interface";

/**
 * Build a `RowLabelInfo` for a project/domain as of `asOf`. `color` is passed in
 * (a project inherits its domain's hue, an orphan has none), so this stays free
 * of the row-grouping concerns that own color assignment.
 */
export function rowLabelInfo(
	entity: Project | Domain,
	isDomain: boolean,
	color: string | undefined,
	asOf: ISODate,
): RowLabelInfo {
	const rec = effectiveRecord(entity.history, asOf);
	return {
		name: entity.name,
		isDomain,
		...(color ? { color } : {}),
		description: entity.description ?? "",
		status: rec.status,
		note: rec.note,
		since: rec.since,
		until: rec.until,
	};
}
