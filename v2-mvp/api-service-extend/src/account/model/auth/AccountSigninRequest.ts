import { ApiProperty } from "@nestjs/swagger";

export class AccountSigninRequest {
    @ApiProperty({ description: 'email as login name' })
    email: string = "";

    @ApiProperty()
    password: string = "";
}