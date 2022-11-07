

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Log4ShareDashboardResponse {

    @ApiProperty()
    id: number;
    @ApiProperty()
    msg: string;

}