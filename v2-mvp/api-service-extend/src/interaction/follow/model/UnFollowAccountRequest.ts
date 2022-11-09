import { ApiProperty } from "@nestjs/swagger";

export class UnFollowAccountRequest {

    @ApiProperty()
    targetAccountId: string;
}