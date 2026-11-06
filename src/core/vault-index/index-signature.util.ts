// Echo-dedup signatures: stable strings over what a file *parsed to*, so an
// echo of our own write (or an edit outside the parsed part) compares equal and
// notifies no one.

import type { BacklogEntry } from "../models/backlog-entry.interface";
import type { Block } from "../models/block.interface";

// ─── day signature (echo-dedup) ────────────────────────────────

/**
 * A stable string over a day's *parsed schedule* — deliberately not the raw
 * file text. Two files differing only in whitespace, or in prose outside the
 * Schedule section, share a signature; an echo of our own write matches memory
 * and notifies no one. This is what stops the view bouncing after an edit.
 *
 * Order-sensitive (block order is meaningful) and covers everything the UI
 * renders: time, title, association, metadata, and each block's tasks.
 */
export function daySignature(blocks: Block[]): string {
	return JSON.stringify(blocks.map(blockSig));
}

type TaskSig = [string, Block["tasks"][number]["status"], [string, string] | null, string | null];
type BlockSig = [
	[number, number] | null,
	string,
	[string, string] | null,
	string | null,
	TaskSig[],
];

function blockSig(b: Block): BlockSig {
	return [
		b.time ? [b.time.start, b.time.end] : null,
		b.title,
		b.assoc ? [b.assoc.kind, b.assoc.id] : null,
		b.metadata ?? null,
		b.tasks.map(taskSig),
	];
}

function taskSig(t: Block["tasks"][number]): TaskSig {
	return [
		t.text,
		t.status,
		t.assoc ? [t.assoc.kind, t.assoc.id] : null,
		t.metadata ?? null,
	];
}

/**
 * A stable string over the backlog's parsed entries — order-sensitive (entry
 * order is user-meaningful) and covering everything the view renders: text,
 * association, resurface date. Excludes `source.line`, which shifts on every
 * edit, so an echo of our own write matches memory and notifies no one.
 */
export function backlogSignature(entries: BacklogEntry[]): string {
	return JSON.stringify(
		entries.map((e) => [
			e.text,
			e.assoc ? [e.assoc.kind, e.assoc.id] : null,
			e.resurface ?? null,
		]),
	);
}
