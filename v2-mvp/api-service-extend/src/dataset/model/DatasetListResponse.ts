import { ApiProperty } from "@nestjs/swagger";
import { PageRequest } from "src/viewModel/base/pageRequest";
import { PageResponse } from "../../viewModel/base/pageResponse";
import { DatasetDetailVO } from "./DatasetDetailVO";

export class DatasetListResponse extends PageResponse {

   
    @ApiProperty({
        description: 'dataset summary list',
    })
    list: DatasetDetailVO[];

}