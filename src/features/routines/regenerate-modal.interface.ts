import type { Block } from "../../core/models/block.interface";
import type { Resolver } from "../../core/vault-index/vault-index.interface";
import type { KairosSettings } from "../settings/settings.interface";
import type { RegenChange } from "./regenerate-routines.type";

export interface RegenerateModalOptions {
	/** The day, as the title names it: "Thu, Oct 29". */
	label: string;
	/** The day's blocks the changes were computed from. */
	blocks: Block[];
	changes: RegenChange[];
	/** The day's note, for the blocks the preview adds. */
	path: string;
	resolve: Resolver;
	settings: KairosSettings;
	onApply: (keys: Set<string>) => void;
}
