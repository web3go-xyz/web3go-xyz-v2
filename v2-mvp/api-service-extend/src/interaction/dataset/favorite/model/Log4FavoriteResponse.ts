import { ApiProperty } from "@nestjs/swagger";

export class Log4FavoriteResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    msg: string;
}