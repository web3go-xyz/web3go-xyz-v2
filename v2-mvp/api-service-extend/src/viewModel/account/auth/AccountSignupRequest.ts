import { ApiProperty } from "@nestjs/swagger";

export class AccountSignupRequest {

    @ApiProperty({ description: 'email used as login name' })
    email: string = "";

    @ApiProperty({ description: 'password , required at least 6 characters in front.' })
    password: string = "";


    @ApiProperty()
    nickName: string = "";

}