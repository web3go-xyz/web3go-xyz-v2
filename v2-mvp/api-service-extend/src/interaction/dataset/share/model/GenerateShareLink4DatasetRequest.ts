import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GenerateShareLink4DatasetRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    datasetId: number;

    @ApiProperty({ required: true, description:'eg: twitter, discord, link' })
    @IsNotEmpty()
    shareChannel: string;
 
}