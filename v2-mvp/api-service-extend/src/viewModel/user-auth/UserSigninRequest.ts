import { ApiProperty } from "@nestjs/swagger";

export class UserSigninRequest {
    @ApiProperty({ description: 'email as login name' })
    username: string = "";

    @ApiProperty()
    password: string = "";
}