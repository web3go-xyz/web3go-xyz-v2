import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PageRequest } from "src/viewModel/base/pageRequest";

export class MyFollowerRequest extends PageRequest {

    @ApiProperty()
    account_id: string;

    @ApiProperty({ default: true, description: 'whether inclde detail info of accounts' })
    includeDetail: boolean = true;
}