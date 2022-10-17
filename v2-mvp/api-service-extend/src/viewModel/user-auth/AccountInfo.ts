import { ApiProperty } from "@nestjs/swagger";
import { AccountEmail } from "src/base/entity/platform-user/Account-Email.entity";
import { AccountWallet } from "src/base/entity/platform-user/Account-Wallet.entity";
import { Account } from "src/base/entity/platform-user/Account.entity";

export class AccountInfo {
    @ApiProperty()
    account: Account;

    @ApiProperty()
    accountEmails: AccountEmail[];

    @ApiProperty()
    accountWallets: AccountWallet[];
}