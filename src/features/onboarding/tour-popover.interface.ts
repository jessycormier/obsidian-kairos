export interface PopoverAction {
	label: string;
	cta?: boolean;
	onClick: () => void;
}

export interface PopoverContent {
	/** "Step 2 of 6", or empty on the last step. */
	progress: string;
	title: string;
	/** Copy with `**bold**` for literal UI labels. */
	body: string;
	link?: { text: string; href: string };
	actions: PopoverAction[];
	onClose: () => void;
}
