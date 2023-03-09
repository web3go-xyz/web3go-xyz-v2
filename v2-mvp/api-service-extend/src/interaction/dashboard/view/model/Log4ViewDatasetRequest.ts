import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class Log4ViewDatasetRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    datasetId: number;

    @Column({
        type: "text",
        name: "referral_code",
    })
    referralCode: string;
}