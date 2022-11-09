



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GenerateShareLink4DashboardResponse {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    dashboardId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    shareChannel: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    referralCode: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    shareLink: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    accountId: string;

}