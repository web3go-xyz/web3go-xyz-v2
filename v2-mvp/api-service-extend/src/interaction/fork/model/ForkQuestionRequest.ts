



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForkQuestionRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    originalQuestionId: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    targetDashboardId: number;

    // @ApiProperty({ required: false })
    // @IsNotEmpty()
    // description: string;

    // @ApiProperty({ required: false })
    // @IsNotEmpty()
    // new_question_name: string;


}