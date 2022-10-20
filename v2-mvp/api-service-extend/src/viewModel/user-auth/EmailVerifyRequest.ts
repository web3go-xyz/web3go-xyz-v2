import { ApiProperty } from "@nestjs/swagger";
import { VerifyCodePurpose } from "src/base/entity/platform-user/VerifyCodeType";

export class EmailVerifyRequest {
    @ApiProperty()
    email: string;

    @ApiProperty({ description: 'support: account,resetPassword', default: 'account' })
    verifyCodePurpose: VerifyCodePurpose
}