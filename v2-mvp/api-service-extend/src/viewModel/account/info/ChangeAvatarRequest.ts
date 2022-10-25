import { ApiProperty } from "@nestjs/swagger";

export class ChangeAvatarRequest {
    @ApiProperty({ required: true })
    accountId: string;
}