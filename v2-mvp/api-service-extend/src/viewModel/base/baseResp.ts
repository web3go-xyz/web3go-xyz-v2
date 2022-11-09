import { ApiProperty } from "@nestjs/swagger";

export class BaseResponse {

    @ApiProperty()
    success?: boolean = true;

    @ApiProperty()
    msg?: string = '';

    constructor() {
        this.success = true;
        this.msg = '';
    }
}