



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GenerateShareLink4DatasetResponse {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    datasetId: number;

    @ApiProperty({ required: true,description:'eg: twitter, discord, link'  })
    @IsNotEmpty()
    shareChannel: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    referralCode: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    shareLink: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    accountId: string;

}