import { Web3SignChallengeRequest } from "./model/Web3SignChallengeRequest";
import { Web3SignChallengeResponse } from "./model/Web3SignChallengeResponse";
import { Web3SignNonceRequest } from "./model/Web3SignNonceRequest";
import { Web3SignNonceResponse } from "./model/Web3SignNonceResponse";

 
export interface IWeb3Sign {
    createChallenge(request: Web3SignNonceRequest): Promise<Web3SignNonceResponse>;
    challenge(request: Web3SignChallengeRequest): Promise<Web3SignChallengeResponse>;

}