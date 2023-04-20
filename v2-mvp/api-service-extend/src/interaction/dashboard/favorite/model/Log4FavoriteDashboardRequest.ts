import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Log4FavoriteDashboardRequest {
    @ApiProperty()
    accountId: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    dashboardId: number;

    @ApiProperty({
        description: '"add" for add favorite, "cancel" for cancel favorite.', default: "add", required: true
    })
    @IsNotEmpty()
    operationFlag: string;
}