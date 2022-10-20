import { Web3SignInChallengeRequest } from "../model/Web3SignInChallengeRequest";
import { Web3SignInChallengeResponse } from "../model/Web3SignInChallengeResponse";
import { Web3SignInNonceRequest } from "../model/Web3SignInNonceRequest";
import { Web3SignInNonceResponse } from "../model/Web3SignInNonceResponse";
import {
    cryptoWaitReady,
    decodeAddress,
    signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { IWeb3Sign } from "../IWeb3Sign";
import { W3Logger } from "src/base/log/logger.service";
const { v4: uuidv4 } = require('uuid');

export class PolkadotSignHelper implements IWeb3Sign {

    logger: W3Logger;

    constructor() {
        this.logger = new W3Logger(`PolkadotSignHelper`);
    }
    async createChallenge(request: Web3SignInNonceRequest): Promise<Web3SignInNonceResponse> {
        let nonce = `[web3_nonce][${new Date().getTime()}][${uuidv4()}]`;
        let challenge = `you are going to approve access to current application, the challenge message is: signin with [${request.chain}][${request.walletSource}][${request.address}]`;

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
        let signature = request.signature;
        let address = request.address;

        resp.verified = await this.isValidSignature(
            challenge,
            signature,
            address
        );

        this.logger.debug(`challenge verify:${JSON.stringify(resp)}`);
        return resp;
    }
    async isValidSignature(signedMessage, signature, address): Promise<boolean> {
        await cryptoWaitReady();
        const publicKey = decodeAddress(address);
        const hexPublicKey = u8aToHex(publicKey);
        console.debug(`signedMessage:${signedMessage},signature:${signature},hexPublicKey:${hexPublicKey}`);

        let isValid = signatureVerify(signedMessage, signature, hexPublicKey)
            .isValid;
        this.logger.debug(`isValid:${isValid},signedMessage:${signedMessage},signature:${signature},hexPublicKey:${hexPublicKey}`);
        return isValid;
    }
}
