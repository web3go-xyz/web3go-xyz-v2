import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PageRequest } from "src/viewModel/base/pageRequest";

export class QueryDashboardByDataset extends PageRequest {

    @ApiProperty({
        description: 'specified datasetId id',
    })
    @IsNotEmpty()
    datasetId: number;
}