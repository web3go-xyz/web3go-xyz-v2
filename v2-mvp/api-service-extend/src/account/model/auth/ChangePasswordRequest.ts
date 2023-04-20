import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordRequest {
    @ApiProperty()
    accountId: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ description: 'code sent by email' })
    code: string;

    @ApiProperty({ description: 'new password' })
    newPassword: string;
}