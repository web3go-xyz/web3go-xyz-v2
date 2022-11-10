

import { ApiProperty } from "@nestjs/swagger";
 
export class AccountStatisticResponse {
    @ApiProperty()
    accountId: string;

    @ApiProperty({
        description: 'count for how many addresses current account are followed by.  others=>current',
    })
    followedAccountCount: number;


    @ApiProperty({
        description: 'count for how many accounts have been followed by current account,  current=>others',
    })
    followingAccountCount: number;

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