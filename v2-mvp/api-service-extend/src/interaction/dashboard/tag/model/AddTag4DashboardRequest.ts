import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsNumber, IsNumberString, IsString, Length, MaxLength } from "class-validator";

export class AddTag4DashboardRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    dashboardId: number;

    @ApiProperty({ required: true, type: Number,default:0 })
    tagId: number;
    
    @ApiProperty({ required: true, type: String,default:'' })
    @MaxLength(50)
    @IsNotEmpty()
    tagName:string

}
