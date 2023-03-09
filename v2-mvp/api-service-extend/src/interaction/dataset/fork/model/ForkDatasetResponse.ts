

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForkDatasetResponse {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    newId: number;


    // @ApiProperty()
    // msg: string;

}