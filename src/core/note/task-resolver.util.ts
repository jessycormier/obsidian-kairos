import type { Block } from "../models/block.interface";
import type { ResolvedTask } from "../models/task.interface";
import type { ISODate } from "../models/time.type";

export function resolveBlocks(blocks: Block[], date: ISODate): ResolvedTask[] {
    const tasks: ResolvedTask[] = [];

    for (const block of blocks) {
        const scheduled = block.scheduled;

        // A block's tasks; the block itself is not a task (it has no status).
        for (const task of block.tasks) {
            tasks.push({
                ...task,
                owner: task.assoc ?? block.assoc,
                block,
                date,
                scheduled,
            })
        }
    }

    return tasks;
}
