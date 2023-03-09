import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Log4ViewRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    dataSetId: number;

    @ApiProperty()
    referralCode: string;

}