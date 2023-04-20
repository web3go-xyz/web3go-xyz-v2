

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForkDashboardResponse {

    @ApiProperty({})
    @IsNotEmpty()
    newDashboardId: number;

    @ApiProperty({})
    @IsNotEmpty()
    newCardIds: number[];


    @ApiProperty()
    msg: string;

}