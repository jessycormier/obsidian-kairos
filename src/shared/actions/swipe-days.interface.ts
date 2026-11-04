export interface SwipeDaysOptions {
	/** Move by `days` (+1 later, −1 earlier). */
	onSwipe: (days: number) => void;
	/** Whether a drag is live, so this touch isn't a swipe. */
	busy?: () => boolean;
}
