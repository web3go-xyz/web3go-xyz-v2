



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Log4ForkDashboardRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    originalDashboardId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    forkedDashboardId: number;


}