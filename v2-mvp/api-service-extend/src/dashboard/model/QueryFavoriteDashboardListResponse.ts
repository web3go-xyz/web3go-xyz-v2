import { ApiProperty } from "@nestjs/swagger";
import { DashboardFavoriteLog } from "src/base/entity/platform-dashboard/DashboardFavoriteLog";
import { PageResponse } from "../../viewModel/base/pageResponse";

export class QueryFavoriteDashboardListResponse extends PageResponse {

    @ApiProperty()
    list: DashboardFavoriteLog[]
}