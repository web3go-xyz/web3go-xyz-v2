

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForkDashboardResponse {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    forkedDashboardId: number;


    @ApiProperty()
    msg: string;

}