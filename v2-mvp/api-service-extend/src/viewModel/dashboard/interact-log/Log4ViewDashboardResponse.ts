import { ApiProperty } from "@nestjs/swagger";

export class Log4ViewDashboardResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    msg: string;
}