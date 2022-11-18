import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PageRequest } from "src/viewModel/base/pageRequest";

export class QueryRelatedDashboardsRequest extends PageRequest {
    @ApiProperty({
        description: 'specified dashboard id',
        default: []
    })
    @IsNotEmpty()
    dashboardId: number[];

    @ApiProperty({
        description: 'tag id list',
        default: [],

    })
    @IsNotEmpty()
    tagIds: number[];
}