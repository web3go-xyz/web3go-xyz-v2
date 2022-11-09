import { ApiProperty } from "@nestjs/swagger";
import { AccountFollower } from "src/base/entity/platform-user/AccountFollower";
import { PageResponse } from "src/viewModel/base/pageResponse";

export class MyFollowerResponse extends PageResponse {


    @ApiProperty()
    list: AccountFollower[];
}