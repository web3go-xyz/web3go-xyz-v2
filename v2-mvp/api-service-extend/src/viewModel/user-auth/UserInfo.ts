import { ApiProperty } from "@nestjs/swagger";

export class UserInfo {
    @ApiProperty()
    web3Id: string;

    @ApiProperty()
    displayName: string = "";

    @ApiProperty()
    imageBase64: string = "";

    @ApiProperty()
    last_login_time: Date;
}