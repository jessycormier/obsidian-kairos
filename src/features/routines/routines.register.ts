// Routines wiring — everything the plugin registers for routines, kept out of
// main.ts: the Routines view and its command, and the "Repeat…" handler that
// task rows reach through `requestRepeat` and block menus through
// `requestRepeatBlock`.

import { Notice, type WorkspaceLeaf } from "obsidian";
import type Kairos from "../../main";
import type { Block } from "../../core/models/block.interface";
import type { Task } from "../../core/models/task.interface";
import { KAIROS_ROUTINES_VIEW_TYPE, KairosRoutinesView } from "./routines.view";
import { RuleModal } from "./rule.modal";
import { blockRepeatDraft, repeatDraft, setRepeatHandler } from "./repeat-routine.util";
import { addRoutine } from "./routines.writer";
import type { RoutineDraft } from "./routines-writer.type";
import { parseRule, ruleSentence } from "./recurrence-rules.util";
import type { Rule } from "./recurrence-rules.type";

export function registerRoutines(plugin: Kairos): void {
	plugin.registerView(KAIROS_ROUTINES_VIEW_TYPE, (leaf) => new KairosRoutinesView(leaf, plugin));

	plugin.addCommand({
		id: "open-routines-view",
		name: "Open routines view",
		callback: () => void activateRoutinesView(plugin),
	});

	setRepeatHandler((block, task) => openRepeat(plugin, block, task));
	plugin.register(() => setRepeatHandler(undefined));
}

/** Reveal the Routines view in a main (center) leaf, reusing one if already open. */
export async function activateRoutinesView(plugin: Kairos): Promise<void> {
	const { workspace } = plugin.app;
	let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(KAIROS_ROUTINES_VIEW_TYPE)[0] ?? null;
	if (!leaf) {
		leaf = workspace.getLeaf("tab");
		await leaf.setViewState({ type: KAIROS_ROUTINES_VIEW_TYPE, active: true });
	}
	void workspace.revealLeaf(leaf);
}

/** "Repeat…" on `task` in `block`, or on the block itself when `task` is absent. */
function openRepeat(plugin: Kairos, block: Block, task?: Task): void {
	if (task) {
		const where = block.time ? `in ${block.title}` : "on the day's list";
		openRuleModal(plugin, task.text, where, (rule) => repeatDraft(task, block, rule));
		return;
	}
	// Only a timed block repeats as a block; the views offer it on no other.
	const time = block.time;
	if (!time) return;
	openRuleModal(plugin, block.title, "as a block at the same time", (rule) =>
		blockRepeatDraft(block, time, rule),
	);
}

function openRuleModal(
	plugin: Kairos,
	name: string,
	where: string,
	draftFor: (rule: Rule) => RoutineDraft,
): void {
	new RuleModal(plugin.app, {
		title: `Repeat “${name}”`,
		description: `It's added to your routines ${where}. This one stays as the first.`,
		initial: parseRule("daily")!,
		confirm: "Repeat",
		onConfirm: (rule) => {
			const draft = draftFor(rule);
			void plugin.routines.edit((md) => addRoutine(md, draft)).then((ok) => {
				if (ok) new Notice(`“${name}” now repeats ${ruleSentence(rule)}.`);
			});
		},
	}).open();
}
