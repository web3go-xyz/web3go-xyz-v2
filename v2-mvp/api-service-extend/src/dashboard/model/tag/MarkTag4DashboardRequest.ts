import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class MarkTag4DashboardRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    dashboardId: number;

    @ApiProperty({ required: true, type: Number, isArray: true })
    @IsNotEmpty()
    tagIds: number[];

}