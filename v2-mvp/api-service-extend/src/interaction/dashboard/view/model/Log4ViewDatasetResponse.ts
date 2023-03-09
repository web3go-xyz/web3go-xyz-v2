import { ApiProperty } from "@nestjs/swagger";

export class Log4ViewDatasetResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    msg: string;
}