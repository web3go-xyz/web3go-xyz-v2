

import { ApiProperty } from "@nestjs/swagger";

export class Log4ShareDatasetResponse {

    @ApiProperty()
    id: number;
    @ApiProperty()
    msg: string;

}