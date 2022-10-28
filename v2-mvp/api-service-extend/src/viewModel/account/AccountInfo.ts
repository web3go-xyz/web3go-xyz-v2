import { ApiProperty } from "@nestjs/swagger";
import { AccountEmail } from "src/base/entity/platform-user/AccountEmail.entity";
import { AccountWallet } from "src/base/entity/platform-user/AccountWallet.entity";
import { Account } from "src/base/entity/platform-user/Account.entity";

export class AccountInfo {
    @ApiProperty()
    account: Account;

    @ApiProperty()
    accountEmails: AccountEmail[];

    @ApiProperty()
    accountWallets: AccountWallet[];
}