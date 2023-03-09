import { ApiProperty } from "@nestjs/swagger";

export class Log4ViewResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    msg: string;
}