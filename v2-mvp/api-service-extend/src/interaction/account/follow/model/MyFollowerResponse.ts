import { ApiProperty } from "@nestjs/swagger";
import { PageResponse } from "src/viewModel/base/pageResponse";

export class AccountFollowerDetail {

    @ApiProperty()
    accountId: string;

    @ApiProperty()
    nickName: string;

    @ApiProperty()
    avatar: string = "";

    @ApiProperty()
    followedAccountCount: number;

    @ApiProperty()
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
export class MyFollowerResponse extends PageResponse {

    @ApiProperty()
    list: AccountFollowerDetail[];
}