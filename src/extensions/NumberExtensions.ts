declare global {
    interface Number {
        toFixedCeil(decimals: number): string
    }
}

Number.prototype.toFixedCeil = function (decimals: number): string {
    const factor = 10 ** decimals
    const result = Number(this) >= 0
        ? Math.ceil(Number(this) * factor) / factor
        : Math.floor(Number(this) * factor) / factor
    return result.toFixed(decimals)
}

export {}

export function toFixedCeil(num: number, decimals: number): string {
    const factor = 10 ** decimals
    const result = num >= 0
        ? Math.ceil(num * factor) / factor
        : Math.floor(num * factor) / factor
    return result.toFixed(decimals)
}

// https://stackoverflow.com/a/9462382/10990079
export const nFormatter = (num: number, digits: number = 0) => {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ]
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
    const item = lookup.findLast(item => num >= item.value)
    return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0"
}