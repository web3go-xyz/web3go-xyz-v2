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

    @ApiProperty({
        description: 'specified the defat status of a dashboard, 0 or default: not limited(mixed the drafted and the posted);  1: draft data only 2: only posted(no drafts)',
        default: null
    })
    draftStatus: number;

    @ApiProperty({
        description: 'filter creator account, FOLLOWING(My following creators), ME(Created by myself)', 
        default: ''
    })
    creatorFilterBy?: 'FOLLOWING' | 'ME';

}

