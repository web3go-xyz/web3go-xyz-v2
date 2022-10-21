import { Web3SignInChallengeRequest } from "../model/Web3SignInChallengeRequest";
import { Web3SignInChallengeResponse } from "../model/Web3SignInChallengeResponse";
import { Web3SignInNonceRequest } from "../model/Web3SignInNonceRequest";
import { Web3SignInNonceResponse } from "../model/Web3SignInNonceResponse";
import { IWeb3Sign } from "../IWeb3Sign";
import { W3Logger } from "src/base/log/logger.service";
import { generateNonce, SiweMessage } from 'siwe';
const { v4: uuidv4 } = require('uuid');

export class MetamaskSignHelper implements IWeb3Sign {

    logger: W3Logger;

    constructor() {
        this.logger = new W3Logger(`MetamaskSignHelper`);
    }
    async createChallenge(request: Web3SignInNonceRequest): Promise<Web3SignInNonceResponse> {

        let nonce = `[web3_nonce][${new Date().getTime()}][${uuidv4()}][${generateNonce()}]`;
        let challenge = `challenge: signin with [${request.chain}][${request.walletSource}][${request.address}]`;

        let resp: Web3SignInNonceResponse = {
            chain: request.chain,
            callbackEndpoint: '/challenge',
            scope: ["address"],
            challenge: challenge,
            nonce: nonce,
            walletSource: request.walletSource,
            address: request.address
        };

        this.logger.debug(`createChallenge:${JSON.stringify(resp)}`);
        return resp;
    }

    async challenge(request: Web3SignInChallengeRequest): Promise<Web3SignInChallengeResponse> {

        this.logger.debug(`challenge request:${JSON.stringify(request)}`);

        let resp: Web3SignInChallengeResponse = {
            ...request,
            verified: false,
            extra: ''
        };
        let challenge = request.challenge;
        let msgObj = JSON.parse(challenge);
        let siweMessage = msgObj.msg;
        let signature = request.signature;
        let address = request.address;

        resp.verified = await this.isValidSignature(
            siweMessage,
            signature,
            address
        );

        this.logger.debug(`challenge verify:${JSON.stringify(resp)}`);
        return resp;
    }

    async isValidSignature(signedMessage, signature, address): Promise<boolean> {
        const siweMessage = new SiweMessage(signedMessage);
        try {
            let isValid = await siweMessage.validate(signature) != null;
            this.logger.debug(`isValid:${isValid},signedMessage:${signedMessage},signature:${signature}`);
            return isValid;
        } catch (error) {
            this.logger.error(error);
        }

        return false;
    }


}
