import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class MarkTag4DatasetRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    datasetId: number;

    @ApiProperty({ required: true, type: Number, isArray: true })
    @IsNotEmpty()
    tagIds: number[];

}