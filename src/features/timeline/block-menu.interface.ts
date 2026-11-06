export interface BlockMenuActions {
	/** A new task in the block. Omitted where none can be added. */
	onAddTask?: () => void;
	/** A new note in the block. Omitted where notes aren't shown. */
	onAddNote?: () => void;
	/** Open the association picker for the block. */
	onEditAssoc: () => void;
	onDelete: () => void;
	/** Open the block in the Day view (the Grid; the timeline is already there). */
	onReveal?: () => void;
	/**
	 * Open the block's project or domain note: Ctrl/Cmd+click on its
	 * association with a mouse, this on touch (spec decision 128). Omitted when
	 * the block has none.
	 */
	onOpenNote?: () => void;
}
