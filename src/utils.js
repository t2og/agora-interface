export function shortenAddress(address, length) {
    if (!length) {
        return "";
    }
    if (!address) {
        return address;
    }
    if (address.length < 10) {
        return address;
    }
    let left = Math.floor((length - 3) / 2) + 1;
    return address.substring(0, left) + "..." + address.substring(address.length - (length - (left + 3)), address.length);
}