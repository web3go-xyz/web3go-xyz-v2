import { BigNumber } from "bignumber.js";
import {Message } from '@arco-design/web-react';

import store from '../store';
export function formatDecimals(
    amount,
    decimals
) {
    let amount_decimals = new BigNumber(amount).div(
        new BigNumber("1e" + decimals)
    );

    // console.log('amount_decimals:', amount_decimals);
    return amount_decimals;
}

export function multiPlyDecimals(
    amount,
    decimals
) {
    let amount_decimals = new BigNumber(amount).multipliedBy(
        new BigNumber("1e" + decimals)
    ).toNumber();
    return amount_decimals;
}

export function shorterAddress(address, lengthThresold = 20, subLength = 5) {
    if (address && address.length > lengthThresold) {
        return (
            address.substring(0, subLength) +
            "..." +
            address.substring(address.length - subLength)
        );
    } else {
        return address;
    }
}

export function copy(text) {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", text);
    input.select();
    if (document.execCommand("copy")) {
        document.execCommand("copy");
        Message.success("Address Copied");
    }
    document.body.removeChild(input);
}
export const getAssetsFile = (url) => {
    return new URL(`../assets/${url}`, import.meta.url).href
}

export function formatTimeZone(time) {
    const zone = store.state.timeZone;
    if (!zone) {
        return ''
    }

    return moment.tz(time, zone.value).format('YYYY-MM-DD HH:mm:ss UTC(Z)')
}
