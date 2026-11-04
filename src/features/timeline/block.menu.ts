// A block's context menu items, shared by the timeline's blocks and the Grid's
// block headers so the two menus stay identical: Add task, Add note, the
// association, Repeat…, Open in day view, and Delete block. A block has no
// status, so there are no status items. Each view supplies the handlers (the timeline edits
// its blocks in place, the Grid commits a pure writer transform); this only
// decides which items show and in what order.
//
// Only a type comes from `obsidian`, so this stays importable from a unit test.

import type { Menu } from "obsidian";
import type { Block } from "../../core/models/block.interface";
import { requestRepeatBlock } from "../routines/repeat-routine.util";
import type { BlockMenuActions } from "./block-menu.interface";

/** "Open in day view". */
export function addRevealItem(menu: Menu, onReveal: () => void): void {
	menu.addItem((item) =>
		item
			.setTitle("Open in day view")
			.setIcon("calendar-clock")
			.onClick(() => onReveal()),
	);
}

/** Add a block's full menu to `menu`. */
export function addBlockMenuItems(menu: Menu, block: Block, actions: BlockMenuActions): void {
	const { onAddTask, onAddNote, onReveal } = actions;
	if (onAddTask) {
		menu.addItem((item) =>
			item
				.setTitle("Add task")
				.setIcon("list-plus")
				.onClick(() => onAddTask()),
		);
	}
	if (onAddNote) {
		menu.addItem((item) =>
			item
				.setTitle("Add note")
				.setIcon("sticky-note")
				.onClick(() => onAddNote()),
		);
	}
	menu.addItem((item) =>
		item
			.setTitle(block.assoc ? "Edit association" : "Add association")
			.setIcon("folder-symlink")
			.onClick(() => actions.onEditAssoc()),
	);
	if (block.time) {
		menu.addItem((item) =>
			item
				.setTitle("Repeat…")
				.setIcon("repeat")
				.onClick(() => requestRepeatBlock(block)),
		);
	}
	if (onReveal) addRevealItem(menu, onReveal);
	if (actions.onOpenNote) {
		const open = actions.onOpenNote;
		menu.addItem((item) =>
			item
				.setTitle("Open note")
				.setIcon("file-text")
				.onClick(() => open()),
		);
	}

	menu.addSeparator();

	menu.addItem((item) =>
		item
			.setTitle("Delete block")
			.setIcon("trash")
			.onClick(() => actions.onDelete()),
	);
}
