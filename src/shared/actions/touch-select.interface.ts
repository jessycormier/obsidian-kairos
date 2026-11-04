export interface TouchSelectOptions {
	/** The row's bar, looked up when needed (it may render conditionally). */
	findBar: () => HTMLElement | null;
	/** Whether `el` belongs to this row and not to a row nested inside it. */
	ownsTarget: (el: Element) => boolean;
	/** Class to put on the row while selected, so its bar shows. */
	awakeClass: string;
	/** The row has a right-click menu: add ⋯ to its bar. */
	menu: () => boolean;
}
