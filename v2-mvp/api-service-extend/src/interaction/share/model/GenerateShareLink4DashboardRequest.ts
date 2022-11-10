import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GenerateShareLink4DashboardRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    dashboardId: number;

    @ApiProperty({ required: true, description:'eg: twitter, discord, link' })
    @IsNotEmpty()
    shareChannel: string;
 
}