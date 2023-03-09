import { ApiProperty } from "@nestjs/swagger";
import { DatasetExt } from "src/base/entity/platform-dataset/DatasetExt";
import { DatasetTagGroup } from "src/base/entity/platform-dataset/DatasetTagGroup";

export class DatasetDetailVO extends DatasetExt {

    @ApiProperty({
        description: 'tag id list related with dataset',
        default: []
    })
    tagList: DatasetTagGroup[];

}