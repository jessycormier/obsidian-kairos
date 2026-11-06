import type { Rule } from "./recurrence-rules.type";

export interface RuleModalOptions {
	title: string;
	/** A line under the title saying what will happen. */
	description?: string;
	initial: Rule;
	confirm: string;
	onConfirm: (rule: Rule) => void;
}
