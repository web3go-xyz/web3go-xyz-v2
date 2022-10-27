
import { IWeb3Sign } from "../IWeb3Sign";
import { W3Logger } from "src/base/log/logger.service";
import { generateNonce, SiweMessage } from 'siwe';
import { Web3SignChallengeRequest } from "../model/Web3SignChallengeRequest";
import { Web3SignChallengeResponse } from "../model/Web3SignChallengeResponse";
import { Web3SignNonceRequest } from "../model/Web3SignNonceRequest";
import { Web3SignNonceResponse } from "../model/Web3SignNonceResponse";

export class MetamaskSignHelper implements IWeb3Sign {

    logger: W3Logger;

    constructor() {
        this.logger = new W3Logger(`MetamaskSignHelper`);
    }
    async createChallenge(request: Web3SignNonceRequest): Promise<Web3SignNonceResponse> {

        let nonce = `${generateNonce()}`;
        let challenge = `${request.nonce_description}: sign with [${request.chain}][${request.walletSource}][${request.address}]`;

        let resp: Web3SignNonceResponse = {
            chain: request.chain,
            challenge: challenge,
            nonce: nonce,
            walletSource: request.walletSource,
            address: request.address
        };

        this.logger.debug(`createChallenge:${JSON.stringify(resp)}`);
        return resp;
    }

    async challenge(request: Web3SignChallengeRequest): Promise<Web3SignChallengeResponse> {

        this.logger.debug(`challenge request:${JSON.stringify(request)}`);

        let resp: Web3SignChallengeResponse = {
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
        this.logger.log(`signedMessage:${JSON.stringify(signedMessage)}`);
        const siweMessage = new SiweMessage(signedMessage);
        this.logger.log(`siweMessage:${JSON.stringify(siweMessage)}`);
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
