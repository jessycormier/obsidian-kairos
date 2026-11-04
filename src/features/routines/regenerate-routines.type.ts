import type { Association } from "../../core/models/association.type";
import type { Block } from "../../core/models/block.interface";
import type { Task } from "../../core/models/task.interface";
import type { TimeRange } from "../../core/models/time.type";
import type { BlockRoutine, Routine, TaskRoutine } from "./routines-file.interface";

export type RegenChange =
	| {
			kind: "assoc";
			key: string;
			routine: BlockRoutine;
			block: Block;
			from?: Association;
			to?: Association;
	  }
	| {
			kind: "task-assoc";
			key: string;
			routine: TaskRoutine;
			block: Block;
			task: Task;
			from?: Association;
			to?: Association;
	  }
	| { kind: "time"; key: string; routine: BlockRoutine; block: Block; from: TimeRange; to: TimeRange }
	| { kind: "task"; key: string; routine: TaskRoutine; home: string }
	| { kind: "missing"; key: string; routine: Routine };

export type RegenKind = RegenChange["kind"];
