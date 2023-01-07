

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForkQuestionResponse {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    newQuestionId: number;


    @ApiProperty()
    msg: string;

}