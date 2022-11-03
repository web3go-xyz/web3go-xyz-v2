import { ApiProperty } from "@nestjs/swagger";
import { DashboardSummary } from "./DashboardSummary";

export class QueryDashboardDetailResponse {
    @ApiProperty({
        description: 'dashboard summary list',
    })
    list: DashboardSummary[];
}