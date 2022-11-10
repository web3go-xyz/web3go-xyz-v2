

import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/base/entity/platform-user/Account.entity";

export class AccountStatisticResponse {
    @ApiProperty()
    accountId: string;

    @ApiProperty()
    dashboard_count: number;

    @ApiProperty()
    total_share_count: number;

    @ApiProperty()
    total_view_count: number;

    @ApiProperty()
    total_favorite_count: number;

    @ApiProperty()
    total_fork_count: number;

} 