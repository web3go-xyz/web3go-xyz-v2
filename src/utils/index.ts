import { BigNumber } from "bignumber.js";
import { ElMessage } from 'element-plus'
import store from '../store';
export function formatDecimals(
  amount: any,
  decimals: number
): BigNumber {
  let amount_decimals = new BigNumber(amount).div(
    new BigNumber("1e" + decimals)
  );

  // console.log('amount_decimals:', amount_decimals);
  return amount_decimals;
}

export function multiPlyDecimals(
  amount: any,
  decimals: number
): number {
  let amount_decimals = new BigNumber(amount).multipliedBy(
    new BigNumber("1e" + decimals)
  ).toNumber();
  return amount_decimals;
}

export function shorterAddress(address: string, lengthThresold: number = 20, partNumber: number = 7): string {
  if (address && address.length > lengthThresold) {
    let subLength = address.length / 7;
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
    ElMessage.success("Address Copied");
  }
  document.body.removeChild(input);
}
export const getAssetsFile = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href
}

export function formatTimeZone(time) {
  const zone = store.state.timeZone;
  if (!zone) {
    return ''
  }

  return moment.tz(time, zone.value).format('YYYY-MM-DD HH:mm:ss UTC(Z)')
}
