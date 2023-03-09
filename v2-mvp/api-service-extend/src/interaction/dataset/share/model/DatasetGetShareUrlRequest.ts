import { ApiProperty } from "@nestjs/swagger";

class KeyValue {
    key: string;
    value: string;
}

export class DatasetGetShareUrlRequest {

    @ApiProperty({
        description: 'platform, now supports: twitter'
    })
    platform: string;

    // TODO SHOULD ADD A REF_CODE


    @ApiProperty({
        description: 'datasetId id'
    })
    datasetId: number;

    @ApiProperty({
        description: 'the SNS required metaData for sharing related with the dataset',
        default: []
    })
    metaData: KeyValue[];
}

