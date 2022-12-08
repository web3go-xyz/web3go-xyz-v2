

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForkQuestionResponse {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    forkedQuestionId: number;


    @ApiProperty()
    msg: string;

}