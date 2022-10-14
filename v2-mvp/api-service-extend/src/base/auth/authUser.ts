import { ApiProperty } from "@nestjs/swagger";

export class AuthUser {

    @ApiProperty({ description: '' })
    id!: string;

    @ApiProperty({ description: '' })
    name!: string;

    @ApiProperty({ description: '' })
    token?: string;

}