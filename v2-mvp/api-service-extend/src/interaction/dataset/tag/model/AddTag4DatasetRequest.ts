import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsNumber, IsNumberString, IsString, Length, MaxLength } from "class-validator";

export class AddTag4DatasetRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    datasetId: number;

    @ApiProperty({ required: true, type: Number,default:0 })
    tagId: number;
    
    @ApiProperty({ required: true, type: String,default:'' })
    @MaxLength(50)
    @IsNotEmpty()
    tagName:string

}
