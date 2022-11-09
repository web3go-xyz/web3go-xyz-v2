import { ApiProperty } from "@nestjs/swagger";
import { PageResponse } from "../../viewModel/base/pageResponse";
import { DashboardSummary } from "./DashboardSummary";

export class QueryDashboardListResponse extends PageResponse {
    @ApiProperty({
        description: 'dashboard summary list',
    })
    list: DashboardSummary[];
}
