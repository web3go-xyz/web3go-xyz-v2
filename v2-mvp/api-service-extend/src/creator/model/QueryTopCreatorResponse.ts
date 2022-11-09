import { ApiProperty } from "@nestjs/swagger";
import { PageResponse } from "src/viewModel/base/pageResponse";

export class CreatorStatistic {
    @ApiProperty()

    creatorAccountId: string;
    @ApiProperty()
    dashboardCount: string;
}
export class QueryTopCreatorResponse extends PageResponse {
    @ApiProperty()
    list: CreatorStatistic[]
}