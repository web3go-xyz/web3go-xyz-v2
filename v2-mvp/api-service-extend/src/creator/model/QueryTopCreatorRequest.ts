import { ApiProperty } from "@nestjs/swagger";
import { PageRequest } from "src/viewModel/base/pageRequest";



export class QueryTopCreatorRequest extends PageRequest {

    @ApiProperty({ description: 'any texts that possibly matched by the accountName', default: null })
    accountName: string;
}