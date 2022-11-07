
import {
    cryptoWaitReady,
    decodeAddress,
    signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { IWeb3Sign } from "../IWeb3Sign";
import { W3Logger } from "src/base/log/logger.service";
import { Web3SignNonceRequest } from "../model/Web3SignNonceRequest";
import { Web3SignNonceResponse } from "../model/Web3SignNonceResponse";
import { Web3SignChallengeResponse } from "../model/Web3SignChallengeResponse";
import { Web3SignChallengeRequest } from "../model/Web3SignChallengeRequest";
const { v4: uuidv4 } = require('uuid');

export class PolkadotSignHelper implements IWeb3Sign {

    logger: W3Logger;

    constructor() {
        this.logger = new W3Logger(`PolkadotSignHelper`);
    }
    async createChallenge(request: Web3SignNonceRequest): Promise<Web3SignNonceResponse> {
        let nonce = `web3_nonce-${new Date().getTime()}-${uuidv4()}`;
        // let challenge = `${request.nonce_description}: sign with [${request.chain}][${request.walletSource}][${request.address}]`;
        let challenge = `Welcome to Web3Go! 
        Click to sign in and accept the Web3Go Terms of Service:https://web3go.xyz/tos. 
        This request will not trigger any blockchain transaction or cost any gas fees.
        Your authentication status will reset after 24 hours. 
        Wallet address:
        ${request.address} 
        Nonce:
        ${nonce} 
        `
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
        this.logger.debug(`[isValidSignature] signedMessage:${signedMessage},signature:${signature},hexPublicKey:${hexPublicKey}`);

        let isValid = signatureVerify(signedMessage, signature, hexPublicKey)
            .isValid;
        this.logger.debug(`isValid:${isValid},signedMessage:${signedMessage},signature:${signature},hexPublicKey:${hexPublicKey}`);
        return isValid;
    }
}
