import { ApiProperty } from "@nestjs/swagger";
import { ConfigTag } from "src/base/entity/platform-config/ConfigTag";
import { PageResponse } from "../../viewModel/base/pageResponse";
export class DashboardSummary {

    @ApiProperty({
        description: 'dashboard id',
    })
    id: number;

    @ApiProperty({
        description: 'dashboard name',
    })
    name: string;


    @ApiProperty({
        description: 'dashboard created at time',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'dashboard updated at time',
    })
    updatedAt: Date;

    @ApiProperty({
        description: 'description of dashboard',
    })
    description: string;


    @ApiProperty({
        description: 'creator accountId',
    })
    creatorAccountId: string;

    @ApiProperty({
        description: 'tag  list related with dashboard',
        default: []
    })
    tagList: ConfigTag[];


    @ApiProperty({
        description: 'view count',
    })
    viewCount: number;

    @ApiProperty({
        description: 'share count',
    })
    shareCount: number;

    @ApiProperty({
        description: 'fork count',
    })
    forkCount: number;

    @ApiProperty({
        description: 'favorite count',
    })
    favoriteCount: number;
}
