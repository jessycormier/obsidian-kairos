import type { ISODate } from './models/time.type';

/**
 * A request to reveal a specific block in the Day view. Pushed by the Grid view
 * when a scheduled task's block badge is clicked; consumed by the Day view,
 * which navigates to `date` and scrolls the block (identified by its source
 * `line`) into view. `nonce` makes two requests for the same target distinct,
 * so a repeat click still notifies subscribers.
 */
export interface RevealRequest {
	date: ISODate;
	blockLine: number;
	nonce: number;
}

/**
 * A filtered-backlog request from the Projects & Domains page. `names` is the
 * allow-list of association names an entry may carry to be shown (the domain
 * plus its child projects for a domain button; just the project for a project
 * button — spec §5, settled rule). `label` names the filter for the header
 * ("Health", "Learn Spanish"). `nonce` makes repeat clicks distinct.
 */
export interface BacklogFilter {
	names: string[];
	label: string;
	nonce: number;
}
