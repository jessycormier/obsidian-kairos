import type { Block } from "../../core/models/block.interface";
import type { Task } from "../../core/models/task.interface";

export interface CarryResult {
	from: Block[];
	to: Block[];
	moved: number;
}

/** A task left open on an earlier day, with the block it sits in. */
export interface Leftover {
	owner: Block;
	task: Task;
}
