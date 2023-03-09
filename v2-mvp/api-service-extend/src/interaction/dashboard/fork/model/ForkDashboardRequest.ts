



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForkDashboardRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    originalDashboardId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    description: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    new_dashboard_name: string;


}