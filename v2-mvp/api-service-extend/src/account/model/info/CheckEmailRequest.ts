import { ApiProperty } from "@nestjs/swagger";

export class CheckEmailRequest {
    @ApiProperty({ required: true })
    accountId: string;

    @ApiProperty({ required: true })
    email: string;

}