import { ApiProperty } from "@nestjs/swagger";
import { VerifyCodePurpose } from "../VerifyCodeType";
 
export class EmailVerifyRequest {
    @ApiProperty()
    email: string;

    @ApiProperty({ description: 'support: account,resetPassword', default: 'account' })
    verifyCodePurpose: VerifyCodePurpose
}