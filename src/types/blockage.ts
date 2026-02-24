import type { SummaryResponse } from "./readingResponse";

export type Status = "Clear" | "Partial" | "Blocked";

export interface BlockageSummaryResponse extends SummaryResponse {
    blockage_status: Status;
}
