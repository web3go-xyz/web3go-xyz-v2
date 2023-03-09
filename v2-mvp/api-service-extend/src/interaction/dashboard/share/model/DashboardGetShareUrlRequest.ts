import { ApiProperty } from "@nestjs/swagger";

class KeyValue {
    key: string;
    value: string;
}

export class DashboardGetShareUrlRequest {

    @ApiProperty({
        description: 'platform, now supports: twitter'
    })
    platform: string;

    // TODO SHOULD ADD A REF_CODE


    @ApiProperty({
        description: 'dashboar id'
    })
    dashboardId: number;

    @ApiProperty({
        description: 'the SNS required metaData for sharing related with the dashboard',
        default: []
    })
    metaData: KeyValue[];
}

