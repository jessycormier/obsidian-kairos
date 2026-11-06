import type { Block } from "../../core/models/block.interface";

export interface ApplyResult {
	blocks: Block[];
	/** How many blocks and tasks were added. */
	added: number;
}
