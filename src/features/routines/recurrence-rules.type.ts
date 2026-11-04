export type Rule =
	| { kind: "weekly"; days: number[] } // 0 = Sunday … 6 = Saturday, sorted
	| { kind: "monthly"; day: number };
