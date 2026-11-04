import type { StatusAnomaly, StatusRecord } from "./project.interface";
import type { SourceRef } from "./source-ref.interface";

export interface Domain {
  id: string;
  name: string;
  aliases: string[];
  description: string; // free-text blurb, shown inline on the projects page
  order: number;
  color: string;
  history: StatusRecord[];
  anomalies?: StatusAnomaly[]; // see `Project.anomalies`
  archived: boolean;
  source: SourceRef;
}
