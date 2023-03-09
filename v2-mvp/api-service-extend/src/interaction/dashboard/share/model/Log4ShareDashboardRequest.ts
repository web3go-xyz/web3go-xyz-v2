import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Log4ShareDashboardRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    dashboardId: number;

    @ApiProperty({ required: true, description: 'eg: twitter, discord, link' })
    @IsNotEmpty()
    shareChannel: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    referralCode: string;

}