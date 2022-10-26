import { ApiProperty } from "@nestjs/swagger";

export class ChangeAvatarRequest {
    @ApiProperty({ required: true })
    accountId: string;

    @ApiProperty({ required: true, description: 'base64 code for avatar' })
    avatar: string;
}