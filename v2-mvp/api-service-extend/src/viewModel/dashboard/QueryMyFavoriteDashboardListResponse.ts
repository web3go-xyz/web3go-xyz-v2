import { ApiProperty } from "@nestjs/swagger";
import { DashboardFavoriteLog } from "src/base/entity/platform-dashboard/DashboardFavoriteLog";
import { PageResponse } from "../base/pageResponse";

export class QueryMyFavoriteDashboardListResponse extends PageResponse {

    @ApiProperty()
    list: DashboardFavoriteLog[]
}