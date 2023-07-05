import { BigNumber } from "bignumber.js";
import { Message } from '@arco-design/web-react';

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
    navigator.clipboard.writeText(text);
    Message.success('Copy success');
}

// 数字千分位分隔显示
export function numberSplit(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&,');
}
export function share(jumpUrl, imgUrl, title) {
    let metaArr = [
        "twitter:card",
        "summary_large_image",
        "twitter:site",
        "https://web3go.xyz",
        "twitter:url",
        jumpUrl,
        "twitter:title",
        title,
        "twitter:image",
        imgUrl,
    ];

    let metaParams = metaArr.toString();
    console.log("\r\noriginal metaParams:\r\n");
    console.log(metaParams);
    // 需要encode两次 因为浏览器会自动decode一次，另一次是服务端会decode

    metaParams = encodeURIComponent(encodeURIComponent(metaParams));

    let backInterfaceUrl = `https://app.web3go.xyz/portal/twittershare?meta=${metaParams}`;
    let fullUrl = `https://twitter.com/share?text=${title}&url=${backInterfaceUrl}`;
    window.open(fullUrl);
}