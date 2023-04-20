import { ApiProperty } from "@nestjs/swagger";

export class LinkEmailRequest {
    @ApiProperty({ required: true })
    accountId: string;

    @ApiProperty({ required: true })
    email: string;

    @ApiProperty({ required: true })
    password: string;

    @ApiProperty({ required: true, description: 'verified code as 6 numbers' })
    code: string;
}