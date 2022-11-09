import { ApiProperty } from "@nestjs/swagger";
import { PageResponse } from "src/viewModel/base/pageResponse";

export class CreatorStatistic {
    @ApiProperty()
    creator_account_id: string;

    @ApiProperty()
    creator_account_name: string;


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

    @ApiProperty()
    following_account_count: number;
}
export class QueryTopCreatorResponse extends PageResponse {
    @ApiProperty()
    list: CreatorStatistic[]
}