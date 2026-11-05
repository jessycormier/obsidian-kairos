/** One entry of the menu: the view's icon, its name, how to open it. */
export interface KairosViewEntry {
	/** Lucide icon name — the same icon the view returns from `getIcon()`. */
	icon: string;
	/** The view's name, matching its tab title. */
	name: string;
	/** Activate the view. */
	open: () => void;
}
