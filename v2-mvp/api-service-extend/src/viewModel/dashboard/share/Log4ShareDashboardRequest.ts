



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Log4ShareDashboardRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    dashboardId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    shareChannel: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    referralCode: string;

}