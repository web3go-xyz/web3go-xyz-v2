import { ApiProperty } from "@nestjs/swagger";

export class DatasetDetailRequest {
    @ApiProperty({
        description: 'specified dataset id list',
        default: []
    })
    datasetIds: number[];
}