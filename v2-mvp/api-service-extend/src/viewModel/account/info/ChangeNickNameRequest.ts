import { ApiProperty } from "@nestjs/swagger";

export class ChangeNickNameRequest {
    @ApiProperty({ required: true })
    accountId: string;
}