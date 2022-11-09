import { ApiProperty } from "@nestjs/swagger";
import { PageRequest } from "../../viewModel/base/pageRequest";

export class QueryDashboardListRequest extends PageRequest {

    @ApiProperty({
        description: 'tag id list related with dashboard',
        default: []
    })
    tagIds: number[];

    @ApiProperty({
        description: 'search name to match dashboard name',
        default: ''
    })
    searchName: string;


    @ApiProperty({
        description: 'search creator account',
        default: ''
    })
    creator: string;


    @ApiProperty({
        description: 'specified dashboard id list',
        default: []
    })
    dashboardIds: number[];
}

