/** A resolved association ready for rendering and navigation. */
export interface ResolvedAssociation {
	/** The current canonical name to display (never an alias). */
	displayName: string;
	/** Domain color, if one applies (directly or via the project's domain). */
	color?: string;
	/** The file path to open on ctrl-click, or undefined when it doesn't resolve. */
	target?: string;
	/** Whether the underlying project/domain file actually exists. */
	resolved: boolean;
}
