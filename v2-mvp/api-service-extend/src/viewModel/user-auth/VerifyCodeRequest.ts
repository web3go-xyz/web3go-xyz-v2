import { ApiProperty } from "@nestjs/swagger";
import { VerifyCodePurpose } from "src/base/entity/platform-user/VerifyCodeType";

export class VerifyCodeRequest {
    @ApiProperty()
    accountId: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ description: 'code from email received' })
    code: string;

    @ApiProperty({ description: 'support: account,resetPassword', default: 'account' })
    verifyCodePurpose: VerifyCodePurpose
}