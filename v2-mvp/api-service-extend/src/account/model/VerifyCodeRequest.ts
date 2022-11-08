import { ApiProperty } from "@nestjs/swagger";
import { VerifyCodePurpose } from "./VerifyCodeType";
 
export class VerifyCodeRequest {
    @ApiProperty()
    accountId: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ description: 'code from email received' })
    code: string;

    @ApiProperty({ description: 'support: account,resetPassword', default: 'account' })
    verifyCodePurpose: VerifyCodePurpose;
}