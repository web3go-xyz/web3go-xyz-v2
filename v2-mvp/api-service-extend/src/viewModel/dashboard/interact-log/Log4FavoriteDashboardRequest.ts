import { ApiProperty } from "@nestjs/swagger";

export class Log4FavoriteDashboardRequest {
    @ApiProperty()
    accountId: string;

    @ApiProperty()
    dashboardId: number;

    @ApiProperty({
        description: 'yes for add favorite, false for cancel favorite.', default: false
    })
    isCancelFavorite: boolean;
}