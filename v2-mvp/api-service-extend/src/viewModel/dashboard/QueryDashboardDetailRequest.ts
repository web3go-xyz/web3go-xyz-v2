import { ApiProperty } from "@nestjs/swagger";

export class QueryDashboardDetailRequest {
    @ApiProperty({
        description: 'specified dashboard id list',
        default: []
    })
    dashboardIds: number[];
}