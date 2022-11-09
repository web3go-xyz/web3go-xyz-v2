import { ApiProperty } from "@nestjs/swagger";

export class Log4FavoriteDashboardResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    msg: string;
}