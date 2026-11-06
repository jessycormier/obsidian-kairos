// Routines view model — the pure shape behind the Routines view.
//
// Routines are grouped by WHEN they repeat: one group per rule, ordered Daily,
// Weekdays, Weekends, day lists (by first weekday), then monthly rules (by day
// of month). Two spellings of the same rule ("Mon, Wed" under one heading and
// `🔁 Monday and Wednesday` on a line elsewhere) land in the same group. Within
// a group, routines keep file order, so a block's tasks follow it.
//
// Pure and vault-free (mirrors features/backlog/backlog.model.ts).

import type { BlockRoutine, Routine, TaskRoutine } from "./routines-file.interface";
import { compareRules, ruleKey, ruleText } from "./recurrence-rules.util";
import type { RoutineBlockGroup, RoutineGroup } from "./routines.interface";

export function groupRoutines(routines: Routine[]): RoutineGroup[] {
	const groups = new Map<string, RoutineGroup>();
	for (const r of routines) {
		const key = ruleKey(r.rule);
		let group = groups.get(key);
		if (!group) {
			group = { key, rule: r.rule, name: ruleText(r.rule), routines: [] };
			groups.set(key, group);
		}
		group.routines.push(r);
	}
	return [...groups.values()]
		.map((g) => ({ ...g, routines: [...g.routines].sort((a, b) => a.line - b.line) }))
		.sort((a, b) => compareRules(a.rule, b.rule));
}

/**
 * A rule group's routines as block groups: timed blocks by start time, each
 * with the tasks homed in it; then homes with no timed block in this group;
 * then Unscheduled, shown even when empty so there's always a place to add a
 * task with no block (the Grid always shows its Unscheduled header too).
 */
export function blockGroupsOf(routines: Routine[]): RoutineBlockGroup[] {
	const blocks = routines
		.filter((r): r is BlockRoutine => r.kind === "block")
		.sort((a, b) => a.time.start - b.time.start || a.time.end - b.time.end || a.line - b.line);
	const tasks = routines.filter((r): r is TaskRoutine => r.kind === "task");
	const claimed = new Set<TaskRoutine>();

	const out: RoutineBlockGroup[] = blocks.map((block) => {
		const own = tasks.filter((t) => !claimed.has(t) && t.home === block.title);
		for (const t of own) claimed.add(t);
		return { key: `block:${block.line}`, block, tasks: own };
	});

	const homes = new Map<string, TaskRoutine[]>();
	const loose: TaskRoutine[] = [];
	for (const t of tasks) {
		if (claimed.has(t)) continue;
		if (!t.home) {
			loose.push(t);
			continue;
		}
		const list = homes.get(t.home);
		if (list) list.push(t);
		else homes.set(t.home, [t]);
	}
	for (const [home, list] of homes) out.push({ key: `home:${home}`, home, tasks: list });
	out.push({ key: "unscheduled", unscheduled: true, tasks: loose });
	return out;
}

/** A stable identity for a routine row within one parse (its source line). */
export function routineKey(r: Routine): number {
	return r.line;
}
