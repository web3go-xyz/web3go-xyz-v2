import { ApiProperty } from "@nestjs/swagger";
import { PageRequest } from "../../viewModel/base/pageRequest";

export class DatasetListRequest extends PageRequest {

    @ApiProperty({
        description: 'tag id list related with dataset',
        default: []
    })
    tagIds: number[];

    @ApiProperty({
        description: 'search name to match dataset name',
        default: ''
    })
    searchName: string;

    @ApiProperty({
        description: 'specified dataset id list',
        default: []
    })
    datasetIds: number[];

    @ApiProperty({
        description: 'search creator account', 
        default: ''
    })
    creator: string;

    @ApiProperty({
        description: 'specified the defaut status of a dataset, 0 or default: not limited(mixed the drafted and the posted);  1: draft data only 2: only posted(no drafts)',
        default: null
    })
    draftStatus: number;


}