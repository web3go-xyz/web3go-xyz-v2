import { Web3SignInChallengeRequest } from "./model/Web3SignInChallengeRequest";
import { Web3SignInChallengeResponse } from "./model/Web3SignInChallengeResponse";
import { Web3SignInNonceRequest } from "./model/Web3SignInNonceRequest";
import { Web3SignInNonceResponse } from "./model/Web3SignInNonceResponse";

export interface IWeb3Sign {
    createChallenge(request: Web3SignInNonceRequest): Promise<Web3SignInNonceResponse>;
    challenge(request: Web3SignInChallengeRequest): Promise<Web3SignInChallengeResponse>;

}