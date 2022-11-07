import { ApiProperty } from "@nestjs/swagger";

export class Log4FavoriteDashboardRequest {
    @ApiProperty()
    accountId: string;

    @ApiProperty()
    dashboardId: number;

    @ApiProperty({
        description: '"add" for add favorite, "cancel" for cancel favorite.', default: "add"
    })
    operationFlag: string;
}