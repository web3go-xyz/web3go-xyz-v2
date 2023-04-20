import { ApiProperty } from "@nestjs/swagger";

export class FollowAccountRequest {
    @ApiProperty()
    targetAccountId: string;
}