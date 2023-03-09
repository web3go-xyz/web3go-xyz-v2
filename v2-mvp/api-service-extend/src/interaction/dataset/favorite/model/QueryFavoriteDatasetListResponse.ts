import { ApiProperty } from "@nestjs/swagger";
import { DatasetFavoriteLog } from "src/base/entity/platform-dataset/DatasetFavoriteLog";
import { PageResponse } from "src/viewModel/base/pageResponse";

export class QueryFavoriteDatasetListResponse extends PageResponse {

    @ApiProperty()
    list: DatasetFavoriteLog[]
}