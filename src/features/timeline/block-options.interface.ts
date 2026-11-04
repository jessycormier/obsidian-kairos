import type { Block } from "../../core/models/block.interface";

export interface BlockOption {
  block: Block;
  // Display label — the block title.
  title: string;
  // "HH:MM–HH:MM" for a timed block, or undefined for an untimed one (e.g. the
  // Unscheduled inbox), so the picker can show/omit a time chip.
  timeLabel?: string;
  // Sort key: minutes-since-midnight of the block's start, or +∞ for untimed so
  // untimed blocks (the inbox) sort to the bottom, matching the file order.
  start: number;
  // True for the Unscheduled inbox and any other untimed block — the picker can
  // label these distinctly ("nest here to keep it unscheduled").
  untimed: boolean;
}
